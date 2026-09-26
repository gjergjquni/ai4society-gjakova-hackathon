"""Case store: classify, merge into municipal problems, persist for Arkiva."""

from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone

import numpy as np
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Feedback, Problem, Report
from app.schemas import (
    ClassifyRequest,
    ClassifyResponse,
    DuplicateOut,
    DuplicateSignalsOut,
    EvidenceOut,
    ProblemOut,
)
from app.services.department import DepartmentClassifier
from app.services.duplicate import DuplicateDetector, blocking_ok
from app.services.embeddings import embed_query
from app.services.intent import IntentClassifier
from app.services.location import normalize_location
from app.services.preprocess import normalize_albanian
from app.services.structured import structured_fields


def _new_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:10].upper()}"


def _title_from(text: str, location_text: str | None) -> str:
    loc = normalize_location(location_text, text)
    body = normalize_albanian(text)
    short = body.split(".")[0].strip()
    if len(short) > 80:
        short = short[:77] + "..."
    if loc.street:
        return f"{short} ({loc.street})"
    return short or "Raport komunal"


class CaseEngine:
    def __init__(
        self,
        intent: IntentClassifier,
        department: DepartmentClassifier,
        duplicate: DuplicateDetector,
    ) -> None:
        self.intent = intent
        self.department = department
        self.duplicate = duplicate

    def classify(self, session: Session, payload: ClassifyRequest) -> ClassifyResponse:
        text = normalize_albanian(payload.text)
        now = datetime.now(timezone.utc)
        intent = self.intent.predict(text)
        dept = self.department.predict(text)
        query_emb = embed_query(text)
        loc = normalize_location(payload.location_text, text)

        open_problems = session.scalars(select(Problem).where(Problem.status != "CLOSED")).all()
        best_id = None
        best_score = -1.0
        best_signals = None
        for problem in open_problems:
            other_loc = normalize_location(problem.location_text, problem.title)
            if not blocking_ok(
                department_id=dept.department_id,
                other_department=problem.department_id,
                loc=loc,
                other_loc=other_loc,
                lat=payload.lat,
                lon=payload.lon,
                other_lat=problem.lat,
                other_lon=problem.lon,
                other_status=problem.status,
                created_at=now,
                other_created_at=problem.last_reported_at,
                window_days=int(self.duplicate.thresholds["window_days"]),
                radius_m=float(self.duplicate.thresholds["geo_radius_m"]),
            ):
                continue
            other_emb = None
            if problem.embedding_json:
                other_emb = np.asarray(json.loads(problem.embedding_json), dtype=np.float32)
            score, signals = self.duplicate.score(
                text=text,
                location_text=payload.location_text,
                lat=payload.lat,
                lon=payload.lon,
                department_id=dept.department_id,
                created_at=now,
                other_text=problem.title,
                other_location=problem.location_text,
                other_lat=problem.lat,
                other_lon=problem.lon,
                other_department=problem.department_id,
                other_created_at=problem.last_reported_at,
                other_embedding=other_emb,
                query_embedding=query_emb,
            )
            if score > best_score:
                best_score = score
                best_id = problem.id
                best_signals = signals

        from app.services.duplicate import DuplicateSignals

        if best_signals is None:
            best_score = 0.0
            best_signals = DuplicateSignals(0.0, 0.0, 0.0, 0.0, 0.0)
        decision = self.duplicate.decide(best_score, best_signals, best_id)

        if decision.decision == "MERGED_INTO_EXISTING_PROBLEM" and best_id:
            problem = session.get(Problem, best_id)
            assert problem is not None
            problem.report_count += 1
            problem.last_reported_at = now
            if problem.lat is None and payload.lat is not None:
                problem.lat = payload.lat
                problem.lon = payload.lon
        else:
            problem = Problem(
                id=_new_id("PRB"),
                title=_title_from(text, payload.location_text),
                department_id=dept.department_id,
                location_text=payload.location_text,
                lat=payload.lat,
                lon=payload.lon,
                status="OPEN",
                first_reported_at=now,
                last_reported_at=now,
                report_count=1,
                embedding_json=json.dumps(query_emb.tolist()),
            )
            session.add(problem)
            session.flush()

        evidence = [
            EvidenceOut(kind=e.kind, id=e.id, text=e.text, source_url=e.source_url)
            for e in dept.evidence
        ]
        report = Report(
            id=_new_id("REQ"),
            created_at=now,
            text=text,
            location_text=payload.location_text,
            lat=payload.lat,
            lon=payload.lon,
            citizen_ref=payload.citizen_ref,
            intent=intent.label,
            department_id=dept.department_id,
            department=dept.department,
            procedure_id=dept.procedure_id,
            confidence=dept.confidence,
            problem_id=problem.id,
            kb_version=dept.kb_version or settings.kb_version,
            model_version=settings.model_version,
            evidence_json=json.dumps([e.model_dump() for e in evidence], ensure_ascii=False),
            status="ROUTED",
        )
        session.add(report)
        session.flush()

        fields = structured_fields(
            title=problem.title,
            text=text,
            department_id=dept.department_id,
            procedure=dept.procedure,
            confidence=dept.confidence,
            has_photo=payload.has_photo,
            evidence_text=evidence[0].text if evidence else dept.procedure,
        )
        return ClassifyResponse(
            report_id=report.id,
            type=intent.label,  # type: ignore[arg-type]
            procedure_id=dept.procedure_id,
            procedure=dept.procedure,
            department_id=dept.department_id,
            department=dept.department,
            confidence=round(dept.confidence, 4),
            title=fields["title"],
            category=fields["category"],
            directorateId=fields["directorateId"],
            sector=fields["sector"],
            priority=fields["priority"],
            summary=fields["summary"],
            evidence=evidence,
            duplicate=DuplicateOut(
                decision=decision.decision,  # type: ignore[arg-type]
                problem_id=problem.id if decision.decision == "MERGED_INTO_EXISTING_PROBLEM" else None,
                score=round(decision.score, 4),
                signals=DuplicateSignalsOut(
                    text=round(best_signals.text, 4),
                    location=round(best_signals.location, 4),
                    department=round(best_signals.department, 4),
                    time=round(best_signals.time, 4),
                    entities=round(best_signals.entities, 4),
                ),
            ),
            problem=ProblemOut(
                id=problem.id,
                title=problem.title,
                department_id=problem.department_id,
                location_text=problem.location_text,
                status=problem.status,
                report_count=problem.report_count,
                first_reported_at=problem.first_reported_at,
                last_reported_at=problem.last_reported_at,
            ),
            status="ROUTED",
            kb_version=report.kb_version,
            model_version=report.model_version,
        )

    def add_feedback(
        self,
        session: Session,
        *,
        report_id: str,
        predicted_department_id: str,
        correct_department_id: str,
        predicted_intent: str | None,
        correct_intent: str | None,
        note: str | None,
    ) -> Feedback:
        row = Feedback(
            id=_new_id("FBK"),
            report_id=report_id,
            predicted_department_id=predicted_department_id,
            correct_department_id=correct_department_id,
            predicted_intent=predicted_intent,
            correct_intent=correct_intent,
            note=note,
        )
        session.add(row)
        session.flush()
        return row
