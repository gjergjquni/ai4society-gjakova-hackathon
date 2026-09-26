from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Problem, Report, utcnow
from ..schemas import ReportCreate, ReportResult
from ..taxonomy import (
    CUSTOM_CATEGORY_ID,
    CUSTOM_CATEGORY_LABEL,
    NEW_ISSUE_COLOR,
    NEW_REASONS,
    UNSPECIFIED_LOCATION,
    get_category,
    get_place,
)
from .duplicates import find_duplicate
from .issues import problem_to_issue


def _next_case_code(db: Session) -> str:
    codes = db.scalars(select(Problem.case_code)).all()
    highest = 1049
    for code in codes:
        if not code.startswith("GJK-"):
            continue
        suffix = code.removeprefix("GJK-")
        if suffix.isdigit():
            highest = max(highest, int(suffix))
    return f"GJK-{highest + 1}"


def create_report(db: Session, payload: ReportCreate) -> tuple[Report, Problem]:
    custom_text = (payload.custom_text or "").strip()
    place = get_place(payload.place_id)

    if payload.category_id:
        route = get_category(payload.category_id)
        category_id = payload.category_id
        category_label = route.label
        department_id = route.department_id
        department_name = route.department_name
        color = route.color
    else:
        category_id = CUSTOM_CATEGORY_ID
        category_label = CUSTOM_CATEGORY_LABEL
        department_id = "SHP"
        department_name = "Drejtoria e Shërbimeve Publike"
        color = NEW_ISSUE_COLOR

    location_text = place.label if place else UNSPECIFIED_LOCATION
    lat = place.lat if place else None
    lon = place.lon if place else None

    candidate = type(
        "Candidate",
        (),
        {
            "category_id": category_id,
            "location_text": location_text,
            "lat": lat,
            "lon": lon,
            "department_id": department_id,
        },
    )()

    problem, score, location_match = find_duplicate(db, candidate)
    now = utcnow()

    if problem is None:
        title = custom_text or f"{category_label} e raportuar"
        recommendation = (
            f"Inspektoni {location_text} dhe konfirmoni {title.lower()} "
            "para se të dërgohet ekipi."
        )
        problem = Problem(
            id=str(uuid4()),
            case_code=_next_case_code(db),
            category=category_label,
            category_id=category_id,
            department_id=department_id,
            department_name=department_name,
            place_id=payload.place_id,
            location_text=location_text,
            lat=lat,
            lon=lon,
            title=title,
            status="Monitorim",
            severity="Mesatare",
            priority=64,
            trend=4,
            impact="1 sinjal i ri",
            recommendation=recommendation,
            reasons=list(NEW_REASONS),
            color=color if category_id != CUSTOM_CATEGORY_ID else NEW_ISSUE_COLOR,
            first_reported_at=now,
            last_reported_at=now,
            report_count=1,
        )
        db.add(problem)
        decision = "NEW_CASE"
        location_match = False
        score = 0.0
    else:
        decision = "MERGED_INTO_EXISTING_PROBLEM"
        problem.last_reported_at = now
        problem.report_count += 1
        problem.priority = min(99, problem.priority + 2)
        problem.trend += 2

    report = Report(
        id=str(uuid4()),
        text=custom_text or category_label,
        custom_text=custom_text,
        location_text=location_text,
        place_id=payload.place_id,
        lat=lat,
        lon=lon,
        has_photo=payload.has_photo,
        category=category_label,
        category_id=category_id,
        department_id=department_id,
        department_name=department_name,
        problem_id=problem.id,
        duplicate_decision=decision,
        location_match=location_match,
        duplicate_score=score,
    )

    db.add(report)
    db.commit()
    db.refresh(report)
    db.refresh(problem)
    return report, problem


def build_report_result(report: Report, problem: Problem) -> ReportResult:
    return ReportResult(
        report_id=report.id,
        problem_id=report.problem_id,
        case_code=problem.case_code,
        created_at=report.created_at,
        category=report.category,
        category_id=report.category_id,
        location_text=report.location_text,
        lat=report.lat,
        lon=report.lon,
        department_id=report.department_id,
        department_name=report.department_name,
        duplicate_decision=report.duplicate_decision,
        duplicate_score=report.duplicate_score,
        location_match=report.location_match,
        has_photo=report.has_photo,
        issue=problem_to_issue(problem, rank=1),
    )
