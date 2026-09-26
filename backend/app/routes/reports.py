from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Report
from ..schemas import ReportCreate, ReportResult
from ..services.reports import build_report_result, create_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post(
    "",
    response_model=ReportResult,
    status_code=status.HTTP_201_CREATED,
)
def create(payload: ReportCreate, db: Session = Depends(get_db)):
    try:
        report, problem = create_report(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return build_report_result(report, problem)


@router.get("/{report_id}", response_model=ReportResult)
def get_report(report_id: str, db: Session = Depends(get_db)):
    report = db.scalar(select(Report).where(Report.id == report_id))
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return build_report_result(report, report.problem)
