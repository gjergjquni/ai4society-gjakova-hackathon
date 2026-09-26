from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas import (
    CaseOut,
    CitizenCaseOut,
    ClassificationUpdate,
    DirectorateStatusUpdate,
    MergeCase,
    RejectCase,
    ResolveCase,
)
from ..taxonomy import DIRECTORATE_IDS
from ..services.cases import (
    approve_case,
    apply_classification,
    case_to_out,
    find_report,
    list_cases,
    merge_case,
    reject_case,
    resolve_case,
    search_citizen_cases,
    set_directorate_status,
)

router = APIRouter(tags=["cases"])


def _require_report(db: Session, report_id: str):
    report = find_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.get("/cases", response_model=list[CaseOut])
def list_all_cases(
    directorate_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if directorate_id and directorate_id not in DIRECTORATE_IDS:
        raise HTTPException(status_code=422, detail="Invalid directorateId")
    return list_cases(db, directorate_id=directorate_id, workflow_status=status)


@router.get("/cases/lookup", response_model=list[CitizenCaseOut])
def lookup_cases(q: str = Query(min_length=3, max_length=40), db: Session = Depends(get_db)):
    return search_citizen_cases(db, q)


@router.get("/cases/{report_id}", response_model=CaseOut)
def get_case(report_id: str, db: Session = Depends(get_db)):
    return case_to_out(_require_report(db, report_id))


@router.patch("/cases/{report_id}", response_model=CaseOut)
def edit_case(
    report_id: str,
    payload: ClassificationUpdate,
    db: Session = Depends(get_db),
):
    report = _require_report(db, report_id)
    apply_classification(report, payload)
    db.commit()
    db.refresh(report)
    return case_to_out(report)


@router.post("/cases/{report_id}/approve", response_model=CaseOut)
def approve(report_id: str, payload: ClassificationUpdate, db: Session = Depends(get_db)):
    try:
        return approve_case(db, _require_report(db, report_id), payload)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.post("/cases/{report_id}/reject", response_model=CaseOut)
def reject(report_id: str, payload: RejectCase, db: Session = Depends(get_db)):
    try:
        return reject_case(db, _require_report(db, report_id), payload.reason)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.post("/cases/{report_id}/merge", response_model=CaseOut)
def merge(report_id: str, payload: MergeCase, db: Session = Depends(get_db)):
    try:
        return merge_case(db, _require_report(db, report_id), payload.targetId)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.patch("/cases/{report_id}/directorate-status", response_model=CaseOut)
def update_directorate_status(
    report_id: str,
    payload: DirectorateStatusUpdate,
    db: Session = Depends(get_db),
):
    try:
        return set_directorate_status(db, _require_report(db, report_id), payload.status)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.post("/cases/{report_id}/resolve", response_model=CaseOut)
def resolve(report_id: str, payload: ResolveCase, db: Session = Depends(get_db)):
    try:
        return resolve_case(db, _require_report(db, report_id), payload)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
