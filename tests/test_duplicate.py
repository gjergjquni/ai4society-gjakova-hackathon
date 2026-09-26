from __future__ import annotations

from datetime import datetime, timezone

from app.services.duplicate import DuplicateDetector
from app.services.location import haversine_m, location_compatible, normalize_location


def _score(detector, a, loc_a, b, loc_b, lat_a=None, lon_a=None, lat_b=None, lon_b=None):
    now = datetime.now(timezone.utc)
    score, signals = detector.score(
        text=a,
        location_text=loc_a,
        lat=lat_a,
        lon=lon_a,
        department_id="INF",
        created_at=now,
        other_text=b,
        other_location=loc_b,
        other_lat=lat_b,
        other_lon=lon_b,
        other_department="INF",
        other_created_at=now,
    )
    return score, signals


def test_same_street_compatible() -> None:
    a = normalize_location("Rruga e Pejës", "Ka gropë")
    b = normalize_location("Rruga e Pejës, Gjakovë", "Rruga është dëmtuar")
    assert location_compatible(a, b)
    assert a.street == b.street


def test_different_street_incompatible() -> None:
    a = normalize_location("Rruga e Pejës", "Ka gropë")
    b = normalize_location("Rruga e Prizrenit", "Ka gropë")
    assert a.street != b.street
    assert not location_compatible(a, b)


def test_same_street_merge_score() -> None:
    detector = DuplicateDetector()
    score, signals = _score(
        detector,
        "Ka një gropë të madhe në rrugën e Pejës.",
        "Rruga e Pejës",
        "Ju lutem rregulloni gropën te rruga e Pejës.",
        "Rruga e Pejës",
        42.3805,
        20.4308,
        42.38055,
        20.43085,
    )
    decision = detector.decide(score, signals, "PRB-1")
    assert signals.location >= 0.5
    assert decision.decision == "MERGED_INTO_EXISTING_PROBLEM"


def test_different_street_no_merge() -> None:
    detector = DuplicateDetector()
    score, signals = _score(
        detector,
        "Ka gropë në rrugën e Pejës.",
        "Rruga e Pejës",
        "Ka gropë në rrugën e Prizrenit.",
        "Rruga e Prizrenit",
    )
    decision = detector.decide(score, signals, "PRB-1")
    assert decision.decision == "NEW_CASE"
    assert signals.location == 0.0


def test_gps_close_merge() -> None:
    detector = DuplicateDetector()
    score, signals = _score(
        detector,
        "Ka gropë këtu.",
        None,
        "Rruga është dëmtuar keq.",
        None,
        42.38050,
        20.43080,
        42.38055,
        20.43088,
    )
    assert haversine_m(42.38050, 20.43080, 42.38055, 20.43088) < 120
    assert signals.location >= 0.5
    assert detector.decide(score, signals, "PRB-1").decision == "MERGED_INTO_EXISTING_PROBLEM"


def test_gps_far_no_merge() -> None:
    detector = DuplicateDetector()
    score, signals = _score(
        detector,
        "Ka gropë këtu.",
        None,
        "Ka gropë këtu.",
        None,
        42.38050,
        20.43080,
        42.39000,
        20.45000,
    )
    assert haversine_m(42.38050, 20.43080, 42.39000, 20.45000) > 200
    assert detector.decide(score, signals, "PRB-1").decision == "NEW_CASE"
