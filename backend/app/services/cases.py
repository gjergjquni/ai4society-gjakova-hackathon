from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from ..models import Problem, Report
from ..schemas import (
    CaseOut,
    CitizenCaseOut,
    ClassificationUpdate,
    ResolveCase,
    ResolutionOut,
    AiAnalysisOut,
    ReportLocationOut,
)
from ..taxonomy import (
    ASSIGNED_STATUSES,
    DIRECTORATE_IDS,
    REVIEW_STATUSES,
    citizen_status_label,
    directorate_name,
    official_directorate_id,
    timeline_for,
    ui_directorate_status,
    ui_status,
)

ALLOWED_DIRECTORATE_TRANSITIONS = {
    "ASSIGNED": {"IN_PROGRESS"},
    "IN_PROGRESS": {"RESOLVED"},
    "RESOLVED": {"VERIFIED", "CLOSED"},
    "VERIFIED": {"CLOSED"},
}


def _as_aware(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def _display_id(report: Report) -> str:
    if report.problem and report.duplicate_decision != "MERGED_INTO_EXISTING_PROBLEM":
        return report.problem.case_code
    if report.problem:
        return f"{report.problem.case_code}-{report.id[:6]}"
    return report.id


def find_report(db: Session, report_id: str) -> Report | None:
    report = db.scalar(select(Report).where(Report.id == report_id))
    if report:
        return report
    problem = db.scalar(
        select(Problem).where(
            (Problem.case_code == report_id) | (Problem.id == report_id)
        )
    )
    if not problem:
        return None
    reports = list(
        db.scalars(
            select(Report)
            .where(Report.problem_id == problem.id)
            .order_by(Report.created_at.desc())
        )
    )
    for item in reports:
        if item.duplicate_decision != "MERGED_INTO_EXISTING_PROBLEM":
            return item
    return reports[0] if reports else None


def case_to_out(report: Report) -> CaseOut:
    problem = report.problem
    created = _as_aware(report.created_at)
    directorate_id = official_directorate_id(report.department_id)
    workflow = report.workflow_status or "PENDING_REVIEW"
    lat = report.lat if report.lat is not None else 42.3806
    lng = report.lon if report.lon is not None else 20.4312
    resolution = None
    if report.resolution_json:
        resolution = ResolutionOut(
            workDescription=report.resolution_json.get("workDescription", ""),
            photoBeforeUrl=report.resolution_json.get("photoBeforeUrl", ""),
            photoAfterUrl=report.resolution_json.get("photoAfterUrl", ""),
            completedAt=report.resolution_json.get("completedAt", ""),
        )
    return CaseOut(
        id=_display_id(report),
        reportId=report.id,
        title=report.title or (problem.title if problem else report.category),
        description=report.custom_text or report.text,
        citizenNotes=report.custom_text or None,
        category=report.category,
        sector=report.sector or "",
        directorateId=directorate_id,
        priority=report.priority_label or "Mesatare",
        status="BASHKUAR" if report.merged_with_id else ui_status(workflow),
        workflowStatus="REJECTED" if report.merged_with_id else workflow,
        directorateStatus=report.directorate_status or ui_directorate_status(workflow),
        createdAt=created,
        date=created.date().isoformat(),
        time=created.strftime("%H:%M"),
        location=ReportLocationOut(
            address=report.location_text,
            lat=lat,
            lng=lng,
            neighborhood=report.neighborhood or report.location_text,
        ),
        photoUrl=report.photo_url or "",
        aiAnalysis=AiAnalysisOut(
            confidence=report.ai_confidence or 0.0,
            suggestedCategory=report.ai_category or report.category,
            suggestedPriority=report.ai_priority or report.priority_label or "Mesatare",
            suggestedDirectorate=official_directorate_id(
                report.ai_directorate_id or report.department_id
            ),
            reasoning=report.ai_summary or "",
        ),
        timeline=report.timeline_json or timeline_for(workflow),
        citizenName=report.citizen_name,
        mergedWithId=report.merged_with_id,
        rejectionReason=report.rejection_reason,
        verifiedBy=report.verified_by,
        resolution=resolution,
    )


def citizen_case_out(report: Report) -> CitizenCaseOut:
    problem = report.problem
    workflow = report.workflow_status or "PENDING_REVIEW"
    return CitizenCaseOut(
        id=_display_id(report),
        case_code=problem.case_code if problem else _display_id(report),
        title=report.title or (problem.title if problem else report.category),
        category=report.category,
        status=citizen_status_label(workflow),
        workflow_status=workflow,
        directorate_id=official_directorate_id(report.department_id),
        directorate_name=directorate_name(report.department_id),
        location_text=report.location_text,
        photo_url=report.photo_url,
        timeline=report.timeline_json or timeline_for(workflow),
        created_at=_as_aware(report.created_at),
        lat=report.lat,
        lon=report.lon,
    )


def list_cases(
    db: Session,
    *,
    directorate_id: str | None = None,
    workflow_status: str | None = None,
) -> list[CaseOut]:
    stmt = select(Report).order_by(Report.created_at.desc())
    if directorate_id:
        directorate_id = official_directorate_id(directorate_id)
        if directorate_id not in DIRECTORATE_IDS:
            return []
        stmt = stmt.where(Report.department_id == directorate_id)
        stmt = stmt.where(Report.workflow_status.in_(ASSIGNED_STATUSES))
    if workflow_status:
        stmt = stmt.where(Report.workflow_status == workflow_status)
    reports = list(db.scalars(stmt).all())
    return [case_to_out(report) for report in reports]


def apply_classification(report: Report, payload: ClassificationUpdate) -> None:
    if payload.title:
        report.title = payload.title
    if payload.category:
        report.category = payload.category
    if payload.sector:
        report.sector = payload.sector
    if payload.directorateId:
        report.department_id = payload.directorateId
        report.department_name = directorate_name(payload.directorateId)
        if report.problem:
            report.problem.department_id = payload.directorateId
            report.problem.department_name = report.department_name
    if payload.priority:
        report.priority_label = payload.priority
    if report.workflow_status in REVIEW_STATUSES:
        report.workflow_status = "PENDING_REVIEW"
        report.timeline_json = timeline_for("PENDING_REVIEW")


def approve_case(db: Session, report: Report, payload: ClassificationUpdate) -> CaseOut:
    if report.workflow_status not in (*REVIEW_STATUSES, "APPROVED"):
        raise ValueError("Raporti nuk mund të aprovohet në këtë status")
    apply_classification(report, payload)
    report.workflow_status = "ASSIGNED"
    report.directorate_status = "NEW"
    report.verified_by = "Arkivisti"
    report.timeline_json = timeline_for("ASSIGNED")
    if report.problem:
        report.problem.department_id = report.department_id
        report.problem.department_name = report.department_name
        report.problem.status = "Në shqyrtim"
        report.problem.title = report.title or report.problem.title
    db.commit()
    db.refresh(report)
    return case_to_out(report)


def reject_case(db: Session, report: Report, reason: str) -> CaseOut:
    if report.workflow_status not in REVIEW_STATUSES:
        raise ValueError("Raporti nuk mund të refuzohet në këtë status")
    report.workflow_status = "REJECTED"
    report.rejection_reason = reason
    report.directorate_status = None
    report.timeline_json = timeline_for("REJECTED")
    if report.problem:
        report.problem.status = "Monitorim"
    db.commit()
    db.refresh(report)
    return case_to_out(report)


def merge_case(db: Session, report: Report, target_id: str) -> CaseOut:
    target = find_report(db, target_id)
    if not target or target.id == report.id:
        raise ValueError("Raporti synues nuk u gjet")
    report.workflow_status = "REJECTED"
    report.merged_with_id = _display_id(target)
    report.timeline_json = ["Raportuar", "Analizuar nga AI", "Në shqyrtim", "Bashkuar"]
    db.commit()
    db.refresh(report)
    return case_to_out(report)


def set_directorate_status(db: Session, report: Report, next_status: str) -> CaseOut:
    current = report.workflow_status
    mapped = {
        "NEW": "ASSIGNED",
        "ACCEPTED": "IN_PROGRESS",
        "IN_PROGRESS": "IN_PROGRESS",
        "RESOLVED": "RESOLVED",
        "VERIFIED": "VERIFIED",
        "CLOSED": "CLOSED",
    }.get(next_status, next_status)
    allowed = ALLOWED_DIRECTORATE_TRANSITIONS.get(current, set())
    if mapped not in allowed and mapped != current:
        raise ValueError("Kalimi i statusit nuk lejohet")
    report.workflow_status = mapped
    report.directorate_status = ui_directorate_status(mapped)
    report.timeline_json = timeline_for(mapped)
    if report.problem:
        if mapped == "IN_PROGRESS":
            report.problem.status = "Eskaluar"
        if mapped in {"RESOLVED", "VERIFIED", "CLOSED"}:
            report.problem.status = "Monitorim"
    db.commit()
    db.refresh(report)
    return case_to_out(report)


def resolve_case(db: Session, report: Report, payload: ResolveCase) -> CaseOut:
    if report.workflow_status not in {"ASSIGNED", "IN_PROGRESS"}:
        raise ValueError("Raporti nuk mund të shënohet i zgjidhur në këtë status")
    today = datetime.now(timezone.utc).date().isoformat()
    report.workflow_status = "RESOLVED"
    report.directorate_status = "RESOLVED"
    report.resolution_json = {
        "workDescription": payload.workDescription,
        "photoBeforeUrl": payload.photoBeforeUrl,
        "photoAfterUrl": payload.photoAfterUrl,
        "completedAt": today,
    }
    report.timeline_json = timeline_for("RESOLVED")
    if report.problem:
        report.problem.status = "Monitorim"
    db.commit()
    db.refresh(report)
    return case_to_out(report)


def search_citizen_cases(db: Session, query: str) -> list[CitizenCaseOut]:
    needle = query.strip()
    if not needle:
        return []
    stmt = (
        select(Report)
        .join(Problem)
        .where(
            or_(
                Report.id == needle,
                Problem.case_code == needle,
                Problem.id == needle,
            )
        )
        .order_by(Report.created_at.desc())
    )
    return [citizen_case_out(report) for report in db.scalars(stmt).all()]
