from datetime import datetime, timezone, timedelta
from sqlalchemy import select

from ..config import DUPLICATE_DAYS, DUPLICATE_DISTANCE_METERS
from ..models import Problem
from ..taxonomy import ACTIVE_STATUSES, CUSTOM_CATEGORY_ID
from .geo import distance_meters
from .normalizer import normalize_location


def duplicate_score(report, problem):
    if report.category_id != problem.category_id:
        return 0.0, False
    if report.category_id == CUSTOM_CATEGORY_ID:
        return 0.0, False

    location_same_text = (
        normalize_location(report.location_text)
        == normalize_location(problem.location_text)
    )

    distance = distance_meters(report.lat, report.lon, problem.lat, problem.lon)
    location_same_geo = distance is not None and distance <= DUPLICATE_DISTANCE_METERS
    location_match = location_same_text or location_same_geo

    if not location_match:
        return 0.0, False

    score = 0.0
    if location_same_text:
        score += 0.65
    if location_same_geo:
        score += 0.25
    if report.department_id == problem.department_id:
        score += 0.10

    return min(score, 1.0), True


def find_duplicate(db, report):
    if report.category_id == CUSTOM_CATEGORY_ID:
        return None, 0.0, False

    cutoff = datetime.now(timezone.utc) - timedelta(days=DUPLICATE_DAYS)

    candidates = db.scalars(
        select(Problem).where(
            Problem.status.in_(ACTIVE_STATUSES),
            Problem.category_id == report.category_id,
            Problem.last_reported_at >= cutoff,
        )
    ).all()

    best = None
    best_score = 0.0

    for problem in candidates:
        score, location_match = duplicate_score(report, problem)
        if location_match and score > best_score:
            best = problem
            best_score = score

    if best is None:
        return None, 0.0, False

    return best, best_score, True
