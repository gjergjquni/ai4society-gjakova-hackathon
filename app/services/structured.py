"""Map classifier output to the shared report contract."""

from __future__ import annotations

from app.taxonomy import DIRECTORATE_BY_ID, official_name

SECTOR_BY_DIRECTORATE = {
    "ADM": "Administratë",
    "FIN": "Administratë",
    "SHP": "Menaxhimi i mbeturinave",
    "INF": "Mirëmbajtja e rrugëve",
    "SHS": "Rrjeti i ujësjellësit",
    "ARS": "Hapësirat publike",
    "KRS": "Hapësirat publike",
    "ZHE": "Administratë",
    "URB": "Urbanizëm",
    "BUJ": "Hapësirat publike",
    "KAD": "Administratë",
    "MSH": "Inspektime",
    "INS": "Inspektime",
}

CATEGORY_BY_DIRECTORATE = {
    "ADM": "Administratë",
    "FIN": "Administratë",
    "SHP": "Mbeturina",
    "INF": "Infrastrukturë",
    "SHS": "Shëndetësi",
    "ARS": "Arsim",
    "KRS": "Ambient",
    "ZHE": "Administratë",
    "URB": "Urbanizëm",
    "BUJ": "Ambient",
    "KAD": "Administratë",
    "MSH": "Ambient",
    "INS": "Inspektime",
}


def valid_directorate(department_id: str | None) -> str:
    if department_id and department_id in DIRECTORATE_BY_ID:
        return department_id
    return "SHP"


def priority_from(text: str, confidence: float) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ("rrezik", "zjarr", "112", "kritike", "aksident")):
        return "Kritike"
    if confidence >= 0.86 or any(word in lowered for word in ("gropë", "grope", "rrjedhje", "urgjent")):
        return "E lartë"
    if confidence < 0.6:
        return "E ulët"
    return "Mesatare"


def structured_fields(
    *,
    title: str,
    text: str,
    department_id: str,
    procedure: str,
    confidence: float,
    has_photo: bool = False,
    evidence_text: str | None = None,
) -> dict:
    directorate_id = valid_directorate(department_id)
    photo_note = " Fotografia e bashkëngjitur u përdor si dëshmi." if has_photo else ""
    summary = evidence_text or procedure or f"Raporti dërgohet te {official_name(directorate_id)}."
    return {
        "title": title[:300] or "Raport komunal",
        "category": CATEGORY_BY_DIRECTORATE[directorate_id],
        "directorateId": directorate_id,
        "sector": SECTOR_BY_DIRECTORATE[directorate_id],
        "priority": priority_from(text, confidence),
        "summary": (summary + photo_note).strip()[:2000],
    }
