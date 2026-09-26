"""Structured classification used when the AI service is unavailable."""

from __future__ import annotations

from ..taxonomy import (
    CATEGORY_LABELS,
    SECTOR_BY_CATEGORY,
    SECTOR_BY_DIRECTORATE,
    directorate_name,
    official_directorate_id,
)

KEYWORD_ROUTES: list[tuple[tuple[str, ...], str, str, str]] = [
    (("zjarr", "112", "emergjenc", "vërshim", "vershim"), "MSH", "Inspektime", "Kritike"),
    (("nderton pa leje", "ndërton pa leje", "denoncoj", "inspektoni"), "INS", "Inspektime", "E lartë"),
    (("leje ndërtimi", "leje ndertimi", "legaliz", "plan rregullativ"), "URB", "Urbanizëm", "Mesatare"),
    (("kadastër", "kadaster", "fletëposedim", "fleteposedim", "hipotek"), "KAD", "Administratë", "Mesatare"),
    (("tatim", "faturë tatimi", "fature tatimi"), "FIN", "Administratë", "Mesatare"),
    (("shkoll", "bursë", "burse", "nxënës", "nxenes"), "ARS", "Hapësirat publike", "Mesatare"),
    (("kultur", "sport", "teatër", "teater"), "KRS", "Hapësirat publike", "E ulët"),
    (("biznes", "certifikatë biznesi", "certifikate biznesi"), "ZHE", "Administratë", "Mesatare"),
    (("certifikatë lindjeje", "gjendje civile", "vendbanim"), "ADM", "Administratë", "Mesatare"),
    (("subvencion", "bujq", "fermër", "fermer"), "BUJ", "Hapësirat publike", "Mesatare"),
    (("gropë", "grope", "asfalt", "trotuar", "ura ", "urë"), "INF", "Mirëmbajtja e rrugëve", "E lartë"),
    (("mbeturin", "kontejner", "ndriçim", "ndricim", "pastrim"), "SHP", "Menaxhimi i mbeturinave", "Mesatare"),
    (("ujë", "uje", "rrjedhje", "epidemi"), "SHS", "Rrjeti i ujësjellësit", "Kritike"),
]


def _priority_from_text(text: str, fallback: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ("rrezik", "kritike", "zjarr", "112", "aksident", "e madhe")):
        return "Kritike"
    if any(word in lowered for word in ("e rrezikshme", "urgjent", "bllokuar")):
        return "E lartë"
    return fallback


def classify_locally(
    *,
    text: str,
    category_id: str | None,
    has_photo: bool = False,
) -> dict:
    body = (text or "").strip()
    folded = body.lower()
    directorate_id = "SHP"
    category = CATEGORY_LABELS.get(category_id or "custom", "Ambient")
    sector = SECTOR_BY_CATEGORY.get(category_id or "custom", "Hapësirat publike")
    priority = "Mesatare"
    confidence = 0.62

    if category_id:
        from ..taxonomy import get_category

        try:
            route = get_category(category_id)
            directorate_id = official_directorate_id(route.department_id)
            category = CATEGORY_LABELS.get(category_id, route.label)
            sector = SECTOR_BY_CATEGORY.get(category_id, SECTOR_BY_DIRECTORATE[directorate_id])
            priority = "Kritike" if category_id == "water" else "E lartë" if category_id in {"pothole", "traffic"} else "Mesatare"
            confidence = 0.74
        except ValueError:
            pass

    for phrases, dept, mapped_sector, mapped_priority in KEYWORD_ROUTES:
        if any(phrase in folded for phrase in phrases):
            directorate_id = dept
            sector = mapped_sector
            priority = mapped_priority
            confidence = max(confidence, 0.78)
            break

    priority = _priority_from_text(body, priority)
    directorate_id = official_directorate_id(directorate_id)
    title = body.split(".")[0].strip()[:80] if body else category
    if not title:
        title = category
    photo_note = " Fotografia e bashkëngjitur u mor parasysh në klasifikim." if has_photo else ""
    summary = (
        f"{title}. Dërgohet te {directorate_name(directorate_id)} "
        f"për {sector.lower()}.{photo_note}"
    )
    return {
        "title": title,
        "category": category,
        "directorateId": directorate_id,
        "sector": sector,
        "priority": priority,
        "summary": summary.strip(),
        "confidence": round(min(confidence, 0.93), 4),
    }
