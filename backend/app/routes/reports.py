from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Report
from ..schemas import ReportCreate, ReportResult
from ..services.reports import build_report_result, create_report
from ..services.uploads import save_photo

router = APIRouter(prefix="/reports", tags=["reports"])


def _optional_float(value) -> float | None:
    if value in (None, ""):
        return None
    return float(value)


@router.post(
    "",
    response_model=ReportResult,
    status_code=status.HTTP_201_CREATED,
)
async def create(request: Request, db: Session = Depends(get_db)):
    photo_url = None
    try:
        content_type = request.headers.get("content-type", "")
        if "multipart/form-data" in content_type:
            form = await request.form()
            upload = form.get("photo")
            if upload is not None and hasattr(upload, "filename"):
                photo_url = save_photo(upload)
            payload = ReportCreate(
                category_id=str(form.get("category_id") or "") or None,
                custom_text=str(form.get("custom_text") or ""),
                place_id=str(form.get("place_id") or "") or None,
                has_photo=str(form.get("has_photo") or "").lower() in {"1", "true", "yes"}
                or bool(photo_url),
                lat=_optional_float(form.get("lat")),
                lon=_optional_float(form.get("lon")),
            )
        else:
            payload = ReportCreate.model_validate(await request.json())
        report, problem = create_report(db, payload, photo_url=photo_url)
    except (ValueError, ValidationError, TypeError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return build_report_result(report, problem)


@router.get("/{report_id}", response_model=ReportResult)
def get_report(report_id: str, db: Session = Depends(get_db)):
    report = db.scalar(select(Report).where(Report.id == report_id))
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return build_report_result(report, report.problem)
