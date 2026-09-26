"""Official-competence hard-negative rules.

These are not keyword toys. Each boost is justified by a documented official
competence conflict (URB/INS, URB/KAD, INF/SHP, FIN/KAD, MSH/INS, …).
The winner is still a procedure/responsibility, then mapped to one directorate.
"""

from __future__ import annotations

from app.services.kb import KnowledgeItem
from app.services.preprocess import fold_for_match

# Phrase groups used only as features for documented conflicts.
PERMIT_SELF = (
    "dua leje",
    "dua te pajisem",
    "dua të pajisem",
    "aplikoj per leje",
    "aplikoj për leje",
    "me duhet leje",
    "më duhet leje",
    "kërkoj leje",
    "kerkoj leje",
    "legalizoj",
    "legalizimi",
    "ndertime pa leje",
    "ndërtime pa leje",
)
ILLEGAL_OTHER = (
    "fqinji",
    "fqinjët",
    "po nderton pa leje",
    "po ndërton pa leje",
    "nderton pa leje",
    "ndërton pa leje",
    "pa leje ndertimi",
    "pa leje ndërtimi",
    "denoncoj",
    "inspektoni",
    "ndaloni punimet",
    "rrenoni",
    "rrënoni",
)
CADASTRAL = (
    "fleeteposedim",
    "fleteposedim",
    "fletëposedim",
    "regjistroj parcelen",
    "regjistroj parcelën",
    "regjistrim te parcels",
    "hipoteke",
    "hipotekë",
    "kufijt",
    "kufijtë",
    "matje gjeodezike",
    "kadaster",
    "kadastër",
    "kopje e planit",
)
PARCELIM_URBAN = (
    "ndaj parcels",
    "ndaj parcelën",
    "ndarje te parcels",
    "ndarje të parcelës",
    "pelqim per parcelim",
    "pëlqim për parcelim",
    "per te ndertuar",
    "për të ndërtuar",
    "parcelim",
)
ROAD_STRUCT = (
    "grope",
    "gropë",
    "gropa",
    "rruga eshte demtuar",
    "rruga është dëmtuar",
    "asfalt",
    "trotuar",
    "ura ",
    "ure e demtuar",
    "deformim",
    "bora ne rruge",
    "bora në rrugë",
    "akull ne rruge",
)
PUBLIC_SERVICE = (
    "ndricim publik",
    "ndriçim publik",
    "llamba nuk",
    "kontejner",
    "mbeturina",
    "koshat",
    "pastrim",
    "park ",
    "parku",
    "gjelberim",
    "gjelbërim",
    "varreza",
    "kafshe endacake",
    "kafshë endacake",
    "ujera te zeza",
    "ujëra të zeza",
    "kanalizim i bllokuar",
)
WATER_HEALTH = (
    "nuk kemi uje",
    "nuk kemi ujë",
    "uje i pistë",
    "ujë i pistë",
    "uje i ndotur",
    "ujë i ndotur",
    "uje i sigurt",
    "epidemi",
)
FIRE_EMERGENCY = (
    "zjarr",
    "po djeg",
    "zjarrfikes",
    "zjarrfikës",
    "112",
    "vershim",
    "vërshim",
    "termet",
    "tërmet",
    "emergjenc",
    "rrezik per jete",
    "rrezik për jetë",
)
CIVIL_STATUS = (
    "certifikate lindjeje",
    "certifikatë lindjeje",
    "certifikate martese",
    "certifikatë martese",
    "kurorezim",
    "kurorëzim",
    "gjendje civile",
    "nderrim emri",
    "ndërrim emri",
    "vendbanim",
    "shtetesi",
    "shtetësi",
)
PROPERTY_TAX = (
    "tatim ne prone",
    "tatim në pronë",
    "fatura e tatimit",
    "borxh tatimor",
)
SCHOOL = (
    "burse",
    "bursë",
    "shkolle",
    "shkollë",
    "nxenes",
    "nxënës",
    "cati e shkolles",
    "çatia e shkollës",
    "oborri i shkolles",
    "parashkollor",
)
BUSINESS_REG = (
    "regjistroj biznes",
    "certifikate biznesi",
    "certifikatë biznesi",
    "takse ne firme",
    "taksë në firmë",
    "orari i punes",
    "orari i punës",
)
MARKET_FINE = (
    "gjobë e padrejtë",
    "gjobë",
    "gjoba",
    "treg pa leje",
    "kioske pa leje",
    "kioskë pa leje",
    "mall i skaduar",
)


def _has(text: str, phrases: tuple[str, ...]) -> bool:
    return any(p in text for p in phrases)


def rule_boosts(raw_text: str, item: KnowledgeItem) -> float:
    """Signed boost for a candidate item. Positive favors the item."""
    t = fold_for_match(raw_text)
    dept = item.department_id
    name = fold_for_match(f"{item.name} {item.text}")
    boost = 0.0

    illegal_report = _has(t, ILLEGAL_OTHER) and not _has(t, ("legalizoj", "legalizimi", "dua leje", "dua të pajisem", "dua te pajisem"))
    self_permit = _has(t, PERMIT_SELF) and not _has(t, ILLEGAL_OTHER)

    if illegal_report:
        if dept == "INS" and (
            "ndërtim" in name or "ndertim" in name or "inspektim" in name or "pa leje" in name
        ):
            boost += 1.6
        if dept == "URB" and "pa leje" in name:
            # URB-20 is legalization of own building, not neighbor denunciation.
            boost -= 1.2
        if dept == "URB" and "leje ndërtimi" in name:
            boost -= 0.8

    if self_permit and ("leje ndërtimi" in t or "leje ndertimi" in t or "ndërtim" in t or "ndertim" in t):
        if dept == "URB" and ("leje" in name or "kushte" in name):
            boost += 1.4
        if dept == "INS":
            boost -= 1.0

    if _has(t, ("legalizoj", "legalizimi", "ndërtime pa leje", "ndertime pa leje")) and not illegal_report:
        if dept == "URB" and "pa leje" in name:
            boost += 1.5
        if dept == "INS":
            boost -= 0.8

    if _has(t, PARCELIM_URBAN) and not _has(t, ("fleeteposedim", "fletëposedim", "hipotekë", "hipoteke")):
        if dept == "URB" and "parcelim" in name:
            boost += 1.5
        if dept == "KAD":
            boost -= 0.9

    if _has(t, CADASTRAL) and not _has(t, PARCELIM_URBAN):
        if dept == "KAD":
            boost += 1.4
        if dept == "URB":
            boost -= 0.9
        if dept == "FIN" and not _has(t, PROPERTY_TAX):
            boost -= 0.5

    if _has(t, ROAD_STRUCT) and not _has(t, PUBLIC_SERVICE):
        if dept == "INF":
            boost += 1.5
        if dept == "SHP":
            boost -= 1.0

    if _has(t, PUBLIC_SERVICE) and not _has(t, ROAD_STRUCT):
        if dept == "SHP":
            boost += 1.5
        if dept == "INF" and "ndriçim" not in name and "ndricim" not in name:
            boost -= 1.0
        if "ndriçim" in t or "ndricim" in t:
            if dept == "SHP":
                boost += 0.6
            if dept == "INF":
                boost -= 1.1

    if _has(t, WATER_HEALTH) and not _has(t, ("kanalizim", "ujëra të zeza", "ujera te zeza")):
        if dept == "SHS":
            boost += 1.4
        if dept == "INF":
            boost -= 0.8
        if dept == "SHP":
            boost -= 0.4

    if _has(t, FIRE_EMERGENCY):
        if dept == "MSH":
            boost += 1.8
        if dept == "INS":
            boost -= 1.2

    if _has(t, CIVIL_STATUS):
        if dept == "ADM":
            boost += 1.6
        else:
            boost -= 0.4

    if _has(t, PROPERTY_TAX) and not _has(t, CADASTRAL):
        if dept == "FIN":
            boost += 1.6
        if dept == "KAD":
            boost -= 1.0

    if _has(t, SCHOOL) and not _has(t, ROAD_STRUCT):
        if dept == "ARS":
            boost += 1.5
        if dept == "INF":
            boost -= 1.0

    if _has(t, BUSINESS_REG) and not _has(t, MARKET_FINE):
        if dept == "ZHE":
            boost += 1.4
        if dept == "INS":
            boost -= 0.8

    if _has(t, MARKET_FINE) and not _has(t, BUSINESS_REG):
        if dept == "INS":
            boost += 1.4
        if dept == "ZHE":
            boost -= 0.8
        if dept == "URB" and "kioskë" not in t and "kioske" not in t:
            boost -= 0.3

    if "kioskë" in t or "kioske" in t:
        if "pa leje" in t or "gjobë" in t or "gjobë" in t:
            if dept == "INS":
                boost += 1.2
            if dept == "URB":
                boost -= 0.8
        elif "dua" in t or "pëlqim" in t or "pelqim" in t:
            if dept == "URB" and ("kiosk" in name or "përkohsh" in name or "perkohsh" in name):
                boost += 1.3
            if dept == "INS":
                boost -= 0.6

    if "subvencion" in t:
        health_sub = "shëndet" in t or "shendet" in t
        culture_sub = "kultur" in t or "sport" in t or "grant" in t
        if not health_sub and not culture_sub:
            if dept == "BUJ":
                boost += 1.8
            if dept == "KRS":
                boost -= 1.2
            if dept == "SHS":
                boost -= 0.6
        elif health_sub and dept == "SHS":
            boost += 1.4
    if "subvencion" in t and ("bujq" in t or "fermer" in t or "grurë" in t or "grure" in t or "blegtori" in t):
        if dept == "BUJ":
            boost += 0.4

    urban_terms = (
        "kushte ndërtimore",
        "kushte ndertimore",
        "leje ndërtimi",
        "leje ndertimi",
        "plan rregullativ",
        "pëlqim për parcelim",
        "pelqim per parcelim",
        "leje mjedisore",
        "leje për rrënim",
        "leje per rrenim",
        "certifikatë e përdorimit",
        "leje gropimi",
        "antena gsm",
        "trafostacion",
        "pano reklam",
    )
    if _has(t, urban_terms) and not illegal_report:
        if dept == "URB":
            boost += 1.7
        if dept == "INS":
            boost -= 1.1
        if dept in {"INF", "KAD", "KRS", "BUJ", "SHP"}:
            boost -= 0.7

    if "ure" in t.split() or " riparim ure" in t or "ura " in t or "urës" in t or "ures" in t:
        if dept == "INF":
            boost += 1.3
        if dept == "MSH" and not _has(t, FIRE_EMERGENCY):
            boost -= 1.0

    if "të hyrave komunale" in t or "te hyrave komunale" in t or "hyrash komunale" in t:
        if dept == "FIN":
            boost += 1.4
        if dept == "BUJ":
            boost -= 1.0

    if "uzurpimi arbitrar" in t or "uzurpim" in t and "shoqërore" in t:
        if dept == "URB":
            boost += 1.2
        if dept == "INS" and not illegal_report:
            boost -= 0.4

    return boost
