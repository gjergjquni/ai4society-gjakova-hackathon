from __future__ import annotations

import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import __version__
from app.config import settings
from app.db import get_session, init_db
from app.models import Problem, Report
from app.schemas import (
    ClassifyRequest,
    ClassifyResponse,
    FeedbackIn,
    FeedbackOut,
    HealthOut,
    ProblemOut,
    ReportCreate,
    ReportOut,
    TaxonomyOut,
)
from app.seed import seed_open_problems
from app.services.case_engine import CaseEngine
from app.services.department import DepartmentClassifier
from app.services.duplicate import DuplicateDetector
from app.services.intent import IntentClassifier
from app.services.kb import load_kb
from app.taxonomy import DIRECTORATES


engine_holder: dict[str, CaseEngine] = {}


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    kb = load_kb()
    intent = IntentClassifier()
    intent.load()
    department = DepartmentClassifier(kb=kb)
    department.load()
    if not department.loaded:
        raise RuntimeError(
            "Department artifacts missing. Run: "
            "python scripts/build_knowledge_base.py && "
            "python scripts/generate_dataset.py && "
            "python scripts/train_intent.py && "
            "python scripts/train_department.py && "
            "python scripts/train_duplicate.py"
        )
    duplicate = DuplicateDetector()
    engine_holder["engine"] = CaseEngine(intent, department, duplicate)
    from app.db import SessionLocal

    with SessionLocal() as session:
        seed_open_problems(session)
        session.commit()
    yield
    engine_holder.clear()


app = FastAPI(
    title="Komuna e Gjakovës — klasifikim dhe routing i rasteve",
    version=__version__,
    description=(
        "Backend për klasifikimin e kërkesave/ankesave, routingun në një nga "
        "13 drejtoritë zyrtare, dhe bashkimin e raporteve të të njëjtit problem."
    ),
    lifespan=lifespan,
)


def get_engine() -> CaseEngine:
    return engine_holder["engine"]


@app.post("/v1/classify", response_model=ClassifyResponse)
def classify(
    payload: ClassifyRequest,
    session: Session = Depends(get_session),
    engine: CaseEngine = Depends(get_engine),
) -> ClassifyResponse:
    return engine.classify(session, payload)


@app.post("/v1/reports", response_model=ClassifyResponse)
def create_report(
    payload: ReportCreate,
    session: Session = Depends(get_session),
    engine: CaseEngine = Depends(get_engine),
) -> ClassifyResponse:
    return engine.classify(session, ClassifyRequest(**payload.model_dump()))


@app.get("/v1/reports/{report_id}", response_model=ReportOut)
def get_report(report_id: str, session: Session = Depends(get_session)) -> ReportOut:
    row = session.get(Report, report_id)
    if not row:
        raise HTTPException(404, "Report not found")
    return ReportOut(
        id=row.id,
        created_at=row.created_at,
        text=row.text,
        location_text=row.location_text,
        lat=row.lat,
        lon=row.lon,
        intent=row.intent,
        department_id=row.department_id,
        department=row.department,
        procedure_id=row.procedure_id,
        confidence=row.confidence,
        problem_id=row.problem_id,
        kb_version=row.kb_version,
        model_version=row.model_version,
        evidence=json.loads(row.evidence_json),
        status=row.status,
    )


@app.get("/v1/problems", response_model=list[ProblemOut])
def list_problems(session: Session = Depends(get_session)) -> list[ProblemOut]:
    rows = session.scalars(select(Problem).order_by(Problem.last_reported_at.desc())).all()
    return [
        ProblemOut(
            id=r.id,
            title=r.title,
            department_id=r.department_id,
            location_text=r.location_text,
            status=r.status,
            report_count=r.report_count,
            first_reported_at=r.first_reported_at,
            last_reported_at=r.last_reported_at,
        )
        for r in rows
    ]


@app.get("/v1/problems/{problem_id}", response_model=ProblemOut)
def get_problem(problem_id: str, session: Session = Depends(get_session)) -> ProblemOut:
    row = session.get(Problem, problem_id)
    if not row:
        raise HTTPException(404, "Problem not found")
    return ProblemOut(
        id=row.id,
        title=row.title,
        department_id=row.department_id,
        location_text=row.location_text,
        status=row.status,
        report_count=row.report_count,
        first_reported_at=row.first_reported_at,
        last_reported_at=row.last_reported_at,
    )


@app.get("/v1/health", response_model=HealthOut)
def health(engine: CaseEngine = Depends(get_engine)) -> HealthOut:
    return HealthOut(
        status="ok",
        kb_version=engine.department.kb.version,
        model_version=settings.model_version,
        directorates=len(DIRECTORATES),
        models_loaded=engine.intent.loaded and engine.department.loaded,
    )


@app.get("/v1/taxonomy", response_model=TaxonomyOut)
def taxonomy() -> TaxonomyOut:
    path = Path(settings.kb_dir) / "taxonomy.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    return TaxonomyOut(
        version=data["version"],
        kb_version=data["kb_version"],
        directorates=data["directorates"],
        hard_negative_rules=data["hard_negative_rules"],
        mapping_rule=data["mapping_rule"],
        confidence_note=data["confidence_note"],
    )


@app.post("/v1/feedback", response_model=FeedbackOut)
def feedback(
    payload: FeedbackIn,
    session: Session = Depends(get_session),
    engine: CaseEngine = Depends(get_engine),
) -> FeedbackOut:
    row = engine.add_feedback(
        session,
        report_id=payload.report_id,
        predicted_department_id=payload.predicted_department_id,
        correct_department_id=payload.correct_department_id,
        predicted_intent=payload.predicted_intent,
        correct_intent=payload.correct_intent,
        note=payload.note,
    )
    return FeedbackOut(
        id=row.id,
        stored=True,
        auto_retrained=False,
        message="Correction stored for later retraining. Models were not changed.",
    )
