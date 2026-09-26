from datetime import datetime, timezone

from ..models import Problem
from ..schemas import Coords, IssueResponse, Reason


def format_age(first_reported_at: datetime) -> str:
    now = datetime.now(timezone.utc)
    created = first_reported_at
    if created.tzinfo is None:
        created = created.replace(tzinfo=timezone.utc)

    seconds = max(0, int((now - created).total_seconds()))
    if seconds < 60:
        return "tani"

    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes}m"

    hours = minutes // 60
    if hours < 24:
        rem = minutes % 60
        return f"{hours}h {rem}m" if rem else f"{hours}h"

    days = hours // 24
    rem_hours = hours % 24
    return f"{days}d {rem_hours}h" if rem_hours else f"{days}d"


def problem_to_issue(problem: Problem, rank: int = 1) -> IssueResponse:
    coords = None
    if problem.lat is not None and problem.lon is not None:
        coords = Coords(lat=problem.lat, lng=problem.lon)

    reasons = [
        Reason(label=item["label"], value=item["value"])
        for item in (problem.reasons or [])
    ]

    return IssueResponse(
        id=problem.case_code,
        rank=rank,
        title=problem.title,
        category=problem.category,
        categoryId=problem.category_id,
        location=problem.location_text,
        reports=problem.report_count,
        priority=problem.priority,
        trend=problem.trend,
        severity=problem.severity,
        status=problem.status,
        department=problem.department_name,
        age=format_age(problem.first_reported_at),
        impact=problem.impact,
        recommendation=problem.recommendation,
        reasons=reasons,
        coords=coords,
        color=problem.color,
    )


def problems_to_issues(problems: list[Problem]) -> list[IssueResponse]:
    ordered = sorted(problems, key=lambda p: (-p.priority, -p.report_count, p.case_code))
    return [problem_to_issue(problem, rank=index) for index, problem in enumerate(ordered, start=1)]
