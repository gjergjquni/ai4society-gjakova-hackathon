"""Gjakova address normalizer and geo compatibility."""

from __future__ import annotations

import math
import re
from dataclasses import dataclass

from app.services.preprocess import fold_for_match, normalize_albanian

STREET_ALIASES: dict[str, str] = {
    "nene tereza": "rruga nene tereza",
    "nena tereze": "rruga nene tereza",
    "nënë tereza": "rruga nene tereza",
    "nëna tereze": "rruga nene tereza",
    "rruga e pejes": "rruga e pejes",
    "rruga e pejës": "rruga e pejes",
    "rruga pejes": "rruga e pejes",
    "rruga e prizrenit": "rruga e prizrenit",
    "rruga prizrenit": "rruga e prizrenit",
    "ismail qemali": "rruga ismail qemali",
    "uck": "rruga uck",
    "uçk": "rruga uck",
    "cabrat": "lagjja cabrati",
    "çabrat": "lagjja cabrati",
    "cabrati": "lagjja cabrati",
    "lagjja e re": "lagjja e re",
    "lagja e re": "lagjja e re",
    "te xhamia": "te xhamia hadum",
    "te xhamia hadum": "te xhamia hadum",
    "xhamia e hadumit": "te xhamia hadum",
    "te spitali": "te spitali",
    "spitali i gjakoves": "te spitali",
    "te stadiumi": "te stadiumi",
    "stadiumi i qytetit": "te stadiumi",
    "qendra": "qendra",
    "sheshi i qytetit": "qendra",
}

STREET_RE = re.compile(
    r"\b(?:rruga|rr\.|lagjja|lagja|lagjia|sheshi|te|tek)\s+[\wëç\-]+(?:\s+[\wëç\-]+){0,3}",
    re.I,
)
PROTOCOL_RE = re.compile(r"\b(?:prot(?:okol)?|ref|lenda|lënda)[\s.:/-]*([A-Z0-9\-/]{4,})\b", re.I)


@dataclass(frozen=True)
class NormalizedLocation:
    raw: str
    street: str | None
    landmark: str | None
    tokens: frozenset[str]
    protocol: str | None


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def extract_protocol(text: str) -> str | None:
    match = PROTOCOL_RE.search(text or "")
    return match.group(1).upper() if match else None


def normalize_location(location_text: str | None, body_text: str = "") -> NormalizedLocation:
    raw = normalize_albanian(location_text or "")
    combined = fold_for_match(f"{raw} {body_text}")
    street = None
    for alias, canon in STREET_ALIASES.items():
        if alias in combined:
            street = canon
            break
    if street is None:
        match = STREET_RE.search(combined)
        if match:
            street = re.sub(r"\s+", " ", match.group(0).lower())
    landmark = None
    for mark in ("te xhamia hadum", "te spitali", "te stadiumi", "qendra"):
        if mark in combined or mark.replace("te ", "") in combined:
            landmark = mark
            break
    tokens = frozenset(t for t in combined.split() if len(t) > 2)
    return NormalizedLocation(
        raw=raw,
        street=street,
        landmark=landmark,
        tokens=tokens,
        protocol=extract_protocol(f"{raw} {body_text}"),
    )


def location_compatible(a: NormalizedLocation, b: NormalizedLocation) -> bool:
    """Incompatible locations must never merge."""
    if a.street and b.street and a.street != b.street:
        # Allow fuzzy same-street if one contains the other after aliasing.
        if a.street not in b.street and b.street not in a.street:
            return False
    return True


def location_score(
    a: NormalizedLocation,
    b: NormalizedLocation,
    lat1: float | None = None,
    lon1: float | None = None,
    lat2: float | None = None,
    lon2: float | None = None,
    radius_m: float = 100.0,
) -> float:
    if not location_compatible(a, b):
        return 0.0
    if (
        lat1 is not None
        and lon1 is not None
        and lat2 is not None
        and lon2 is not None
    ):
        dist = haversine_m(lat1, lon1, lat2, lon2)
        if dist <= radius_m:
            return 1.0
        if dist > radius_m * 3:
            return 0.0
        return max(0.0, 1.0 - dist / (radius_m * 3))
    if a.street and b.street and (a.street == b.street or a.street in b.street or b.street in a.street):
        return 1.0
    if a.landmark and a.landmark == b.landmark:
        return 0.85
    if a.raw and b.raw and fold_for_match(a.raw) == fold_for_match(b.raw):
        return 1.0
    if a.raw and b.raw:
        return 0.35
    return 0.2
