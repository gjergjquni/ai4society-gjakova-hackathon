"""Server-side client for the municipal AI classification service."""

from __future__ import annotations

import logging

import httpx

from ..config import AI_SERVICE_URL, AI_TIMEOUT_SECONDS
from ..taxonomy import DIRECTORATE_IDS, official_directorate_id
from .classification import classify_locally

logger = logging.getLogger(__name__)

REQUIRED_FIELDS = (
    "title",
    "category",
    "directorateId",
    "sector",
    "priority",
    "summary",
    "confidence",
)


def _normalize_payload(raw: dict, fallback: dict) -> dict:
    data = dict(fallback)
    directorate = raw.get("directorateId") or raw.get("department_id")
    if directorate:
        data["directorateId"] = official_directorate_id(str(directorate))
    if raw.get("title") or raw.get("problem", {}).get("title"):
        data["title"] = str(raw.get("title") or raw["problem"]["title"])[:300]
    if raw.get("category"):
        data["category"] = str(raw["category"])[:80]
    if raw.get("sector"):
        data["sector"] = str(raw["sector"])[:80]
    if raw.get("priority") in {"Kritike", "E lartë", "Mesatare", "E ulët"}:
        data["priority"] = raw["priority"]
    if raw.get("summary"):
        data["summary"] = str(raw["summary"])[:2000]
    elif raw.get("procedure"):
        data["summary"] = str(raw["procedure"])[:2000]
    try:
        confidence = float(raw.get("confidence", data["confidence"]))
        data["confidence"] = max(0.0, min(confidence, 1.0))
    except (TypeError, ValueError):
        pass
    if data["directorateId"] not in DIRECTORATE_IDS:
        data["directorateId"] = fallback["directorateId"]
    return data


def analyze_report(
    *,
    text: str,
    location_text: str | None = None,
    lat: float | None = None,
    lon: float | None = None,
    category_id: str | None = None,
    has_photo: bool = False,
    citizen_ref: str | None = None,
) -> dict:
    fallback = classify_locally(
        text=text,
        category_id=category_id,
        has_photo=has_photo,
    )
    payload = {
        "text": text if len(text.strip()) >= 3 else f"{fallback['category']} e raportuar",
        "location_text": location_text,
        "lat": lat,
        "lon": lon,
        "citizen_ref": citizen_ref,
        "has_photo": has_photo,
    }
    try:
        with httpx.Client(timeout=AI_TIMEOUT_SECONDS) as client:
            response = client.post(f"{AI_SERVICE_URL}/v1/classify", json=payload)
            response.raise_for_status()
            raw = response.json()
            if not isinstance(raw, dict):
                raise ValueError("AI response is not an object")
            return _normalize_payload(raw, fallback)
    except Exception as exc:
        logger.warning("AI classification unavailable, using local fallback: %s", exc)
        return fallback
