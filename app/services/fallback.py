"""Rule-based classify path used when trained artifacts are missing."""

from __future__ import annotations

from datetime import datetime, timezone

from app.config import settings
from app.schemas import (
    ClassifyRequest,
    ClassifyResponse,
    DuplicateOut,
    DuplicateSignalsOut,
    ProblemOut,
)
from app.services.structured import structured_fields, valid_directorate
from app.taxonomy import official_name

KEYWORD_ROUTES: list[tuple[tuple[str, ...], str]] = [
    (("zjarr", "112", "emergjenc", "vërshim"), "MSH"),
    (("nderton pa leje", "ndërton pa leje", "denoncoj", "inspektoni"), "INS"),
    (("leje ndërtimi", "leje ndertimi", "legaliz"), "URB"),
    (("kadastër", "kadaster", "hipotek"), "KAD"),
    (("tatim", "faturë tatimi"), "FIN"),
    (("shkoll", "bursë", "burse"), "ARS"),
    (("kultur", "sport"), "KRS"),
    (("biznes", "certifikatë biznesi"), "ZHE"),
    (("gjendje civile", "certifikatë lindjeje"), "ADM"),
    (("subvencion", "bujq"), "BUJ"),
    (("gropë", "grope", "asfalt", "trotuar"), "INF"),
    (("mbeturin", "ndriçim", "ndricim", "kontejner"), "SHP"),
    (("ujë", "uje", "rrjedhje"), "SHS"),
]


class FallbackCaseEngine:
    def classify(self, session, payload: ClassifyRequest) -> ClassifyResponse:
        text = payload.text.strip()
        folded = text.lower()
        department_id = "SHP"
        for phrases, dept in KEYWORD_ROUTES:
            if any(phrase in folded for phrase in phrases):
                department_id = dept
                break
        department_id = valid_directorate(department_id)
        title = text.split(".")[0].strip()[:80] or "Raport komunal"
        fields = structured_fields(
            title=title,
            text=text,
            department_id=department_id,
            procedure=official_name(department_id),
            confidence=0.71,
            has_photo=payload.has_photo,
        )
        now = datetime.now(timezone.utc)
        return ClassifyResponse(
            report_id="REQ-FALLBACK",
            type="ANKESË",
            procedure_id=f"{department_id}-00",
            procedure=official_name(department_id),
            department_id=department_id,
            department=official_name(department_id),
            confidence=0.71,
            title=fields["title"],
            category=fields["category"],
            directorateId=fields["directorateId"],
            sector=fields["sector"],
            priority=fields["priority"],
            summary=fields["summary"],
            evidence=[],
            duplicate=DuplicateOut(
                decision="NEW_CASE",
                problem_id=None,
                score=0.0,
                signals=DuplicateSignalsOut(
                    text=0.0,
                    location=0.0,
                    department=0.0,
                    time=0.0,
                    entities=0.0,
                ),
            ),
            problem=ProblemOut(
                id="PRB-FALLBACK",
                title=fields["title"],
                department_id=department_id,
                location_text=payload.location_text,
                status="OPEN",
                report_count=1,
                first_reported_at=now,
                last_reported_at=now,
            ),
            status="ROUTED",
            kb_version=settings.kb_version,
            model_version=settings.model_version,
        )

    def add_feedback(self, session, **kwargs):
        from app.models import Feedback

        row = Feedback(
            id="FBK-FALLBACK",
            report_id=kwargs.get("report_id", ""),
            predicted_department_id=kwargs.get("predicted_department_id", ""),
            correct_department_id=kwargs.get("correct_department_id", ""),
            predicted_intent=kwargs.get("predicted_intent"),
            correct_intent=kwargs.get("correct_intent"),
            note=kwargs.get("note"),
        )
        session.add(row)
        session.flush()
        return row
