"""Classifier 3 — same real-world municipal problem, not similar wording."""

from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np

from app.config import settings
from app.services.embeddings import cosine, embed_query
from app.services.location import (
    NormalizedLocation,
    location_compatible,
    location_score,
    normalize_location,
)


@dataclass
class DuplicateSignals:
    text: float
    location: float
    department: float
    time: float
    entities: float


@dataclass
class DuplicateDecision:
    decision: str  # NEW_CASE | MERGED_INTO_EXISTING_PROBLEM
    problem_id: str | None
    score: float
    signals: DuplicateSignals


def load_thresholds(path: Path | None = None) -> dict:
    path = path or (settings.artifacts_dir / "duplicate_thresholds.json")
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {
        "merge_threshold": settings.merge_threshold,
        "window_days": settings.duplicate_window_days,
        "geo_radius_m": settings.geo_radius_meters,
        "weights": {
            "text": 0.28,
            "location": 0.34,
            "department": 0.16,
            "time": 0.10,
            "entities": 0.12,
        },
    }


def _aware(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def time_score(a: datetime, b: datetime, window_days: int) -> float:
    delta = abs((_aware(a) - _aware(b)).total_seconds()) / 86400.0
    if delta > window_days:
        return 0.0
    return float(max(0.0, 1.0 - delta / window_days))


def entity_score(loc_a: NormalizedLocation, loc_b: NormalizedLocation, text_a: str, text_b: str) -> float:
    if loc_a.protocol and loc_b.protocol and loc_a.protocol == loc_b.protocol:
        return 1.0
    shared = loc_a.tokens & loc_b.tokens
    street_tokens = {"rruga", "lagjja", "lagja", "sheshi"}
    useful = {t for t in shared if t not in street_tokens and len(t) > 3}
    if loc_a.street and loc_a.street == loc_b.street:
        return 0.9
    if useful:
        return min(1.0, 0.25 * len(useful))
    return 0.0


class DuplicateDetector:
    def __init__(self, artifacts_dir: Path | None = None) -> None:
        self.thresholds = load_thresholds(
            (artifacts_dir or settings.artifacts_dir) / "duplicate_thresholds.json"
        )

    def score(
        self,
        *,
        text: str,
        location_text: str | None,
        lat: float | None,
        lon: float | None,
        department_id: str,
        created_at: datetime,
        other_text: str,
        other_location: str | None,
        other_lat: float | None,
        other_lon: float | None,
        other_department: str,
        other_created_at: datetime,
        other_embedding: np.ndarray | None = None,
        query_embedding: np.ndarray | None = None,
    ) -> tuple[float, DuplicateSignals]:
        loc_a = normalize_location(location_text, text)
        loc_b = normalize_location(other_location, other_text)
        q = query_embedding if query_embedding is not None else embed_query(text)
        o = other_embedding if other_embedding is not None else embed_query(other_text)
        text_s = max(0.0, cosine(q, o))
        loc_s = location_score(
            loc_a,
            loc_b,
            lat,
            lon,
            other_lat,
            other_lon,
            radius_m=float(self.thresholds["geo_radius_m"]),
        )
        dept_s = 1.0 if department_id == other_department else 0.0
        time_s = time_score(created_at, other_created_at, int(self.thresholds["window_days"]))
        ent_s = entity_score(loc_a, loc_b, text, other_text)
        if loc_a.protocol and loc_b.protocol and loc_a.protocol == loc_b.protocol:
            signals = DuplicateSignals(text_s, 1.0, dept_s, time_s, 1.0)
            return 1.0, signals
        if not location_compatible(loc_a, loc_b):
            signals = DuplicateSignals(text_s, 0.0, dept_s, time_s, ent_s)
            return 0.0, signals
        w = self.thresholds["weights"]
        composite = (
            w["text"] * text_s
            + w["location"] * loc_s
            + w["department"] * dept_s
            + w["time"] * time_s
            + w["entities"] * ent_s
        )
        # Location is required for merge. Similar text on different streets stays NEW.
        if loc_s < 0.5:
            composite *= 0.35
        elif loc_s >= 0.95 and dept_s == 1.0 and time_s > 0:
            composite = max(composite, 0.84)
        return float(composite), DuplicateSignals(text_s, loc_s, dept_s, time_s, ent_s)

    def decide(
        self,
        score: float,
        signals: DuplicateSignals,
        problem_id: str | None,
    ) -> DuplicateDecision:
        threshold = float(self.thresholds["merge_threshold"])
        if (
            problem_id
            and score >= threshold
            and signals.location >= 0.5
            and signals.department >= 1.0
            and signals.text >= 0.45
        ):
            return DuplicateDecision(
                decision="MERGED_INTO_EXISTING_PROBLEM",
                problem_id=problem_id,
                score=score,
                signals=signals,
            )
        return DuplicateDecision(
            decision="NEW_CASE",
            problem_id=None,
            score=score,
            signals=signals,
        )


def blocking_ok(
    *,
    department_id: str,
    other_department: str,
    loc: NormalizedLocation,
    other_loc: NormalizedLocation,
    lat: float | None,
    lon: float | None,
    other_lat: float | None,
    other_lon: float | None,
    other_status: str,
    created_at: datetime,
    other_created_at: datetime,
    window_days: int,
    radius_m: float,
) -> bool:
    """Only compare against OPEN problems that share department, street, or nearby geo."""
    if other_status == "CLOSED":
        return False
        created_at = _aware(created_at)
        other_created_at = _aware(other_created_at)
        if abs((created_at - other_created_at).total_seconds()) > window_days * 86400:
            return False
    if department_id == other_department:
        return True
    if loc.street and loc.street == other_loc.street:
        return True
    if (
        lat is not None
        and lon is not None
        and other_lat is not None
        and other_lon is not None
    ):
        from app.services.location import haversine_m

        return haversine_m(lat, lon, other_lat, other_lon) <= radius_m * 2
    return False
