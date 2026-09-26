"""Canonical Gjakova Municipal Taxonomy v1.0 — 13 directorates."""

from __future__ import annotations

from typing import TypedDict


class Directorate(TypedDict):
    id: str
    official_name: str
    short_name: str
    file: str
    neni: str


TAXONOMY_VERSION = "1.0"
KB_VERSION = "1.0.0"

DIRECTORATES: list[Directorate] = [
    {
        "id": "ADM",
        "official_name": "Drejtoria e Administratës",
        "short_name": "Administrata",
        "file": "administrata.json",
        "neni": "Neni 9",
    },
    {
        "id": "FIN",
        "official_name": "Drejtoria për Buxhet dhe Financa",
        "short_name": "Buxhet dhe Financa",
        "file": "buxhet_financa.json",
        "neni": "Neni 10",
    },
    {
        "id": "SHP",
        "official_name": "Drejtoria për Shërbime Publike",
        "short_name": "Shërbime Publike",
        "file": "sherbime_publike.json",
        "neni": "Neni 11",
    },
    {
        "id": "INF",
        "official_name": "Drejtoria për Infrastrukturë",
        "short_name": "Infrastrukturë",
        "file": "infrastrukture.json",
        "neni": "Neni 12",
    },
    {
        "id": "SHS",
        "official_name": "Drejtoria për Shëndetësi dhe Mirëqenie Sociale",
        "short_name": "Shëndetësi",
        "file": "shendetsi.json",
        "neni": "Neni 13",
    },
    {
        "id": "ARS",
        "official_name": "Drejtoria për Arsim",
        "short_name": "Arsim",
        "file": "arsim.json",
        "neni": "Neni 14",
    },
    {
        "id": "KRS",
        "official_name": "Drejtoria për Kulturë, Rini dhe Sport",
        "short_name": "Kulturë",
        "file": "kulture.json",
        "neni": "Neni 15",
    },
    {
        "id": "ZHE",
        "official_name": "Drejtoria për Zhvillim Ekonomik",
        "short_name": "Zhvillim Ekonomik",
        "file": "zhvillim_ekonomik.json",
        "neni": "Neni 8",
    },
    {
        "id": "URB",
        "official_name": "Drejtoria për Urbanizëm dhe Mbrojtje të Mjedisit",
        "short_name": "Urbanizëm",
        "file": "urbanizem.json",
        "neni": "Neni 17",
    },
    {
        "id": "BUJ",
        "official_name": "Drejtoria për Bujqësi, Pylltari dhe Zhvillim Rural",
        "short_name": "Bujqësi",
        "file": "bujqesi.json",
        "neni": "Neni 18",
    },
    {
        "id": "KAD",
        "official_name": "Drejtoria për Gjeodezi, Kadastër dhe Pronë",
        "short_name": "Kadastër",
        "file": "kadaster.json",
        "neni": "Neni 19",
    },
    {
        "id": "MSH",
        "official_name": "Drejtoria për Mbrojtje dhe Shpëtim",
        "short_name": "Mbrojtje dhe Shpëtim",
        "file": "mbrojtje_shpetim.json",
        "neni": "Neni 20",
    },
    {
        "id": "INS",
        "official_name": "Drejtoria për Inspektime",
        "short_name": "Inspektime",
        "file": "inspektime.json",
        "neni": "Neni 21",
    },
]

DIRECTORATE_BY_ID: dict[str, Directorate] = {d["id"]: d for d in DIRECTORATES}

REGULATION_URL_MAY = (
    "https://gjakova.rks-gov.net/wp-content/uploads/2025/05/"
    "Rregullore-per-Organizimin-e-Brendshem-ne-Komunen-e-Gjakoves.pdf"
)
REGULATION_URL_APR = (
    "https://gjakova.rks-gov.net/wp-content/uploads/2025/04/"
    "Rregullore-per-Organizimin-e-Brendshem-ne-Komunen-e-Gjakoves.pdf"
)
REGULATION_TITLE = (
    "Rregullore për Organizimin e Brendshëm, Sistematizimin dhe "
    "Klasifikimin e Vendeve të Punës në Komunën e Gjakovës "
    "(nr. 01-011/01-16155, miratuar 27.03.2025)"
)

STAFF_URLS: dict[str, str] = {
    "ADM": "https://gjakova.rks-gov.net/staff/drejtoria-per-pune-te-pergjithshme-administrative/",
    "FIN": "https://gjakova.rks-gov.net/staff/drejtoria-per-buxhet-dhe-financa/",
    "SHP": "https://gjakova.rks-gov.net/staff/drejtoria-per-sherbime-publike/",
    "INF": "https://gjakova.rks-gov.net/staff/drejtoria-per-infrastrukture/",
    "SHS": "https://gjakova.rks-gov.net/staff/drejtoria-per-shendetesi-dhe-mireqenje-sociale/",
    "ARS": "https://gjakova.rks-gov.net/staff/drejtoria-per-arsim-shkence-dhe-teknologji/",
    "KRS": "https://gjakova.rks-gov.net/staff/drejtoria-per-kulture-rini-dhe-sport/",
    "ZHE": "https://gjakova.rks-gov.net/staff/drejtoria-per-zhvillim-ekonomik/",
    "URB": "https://gjakova.rks-gov.net/staff/drejtoria-per-urbanizem-dhe-mbrojtje-te-mjedisit/",
    "BUJ": "https://gjakova.rks-gov.net/staff/drejtoria-per-bujqesi-pylltari-dhe-zhvillim-rural/",
    "KAD": "https://gjakova.rks-gov.net/staff/drejtoria-per-gjeodezi-kadaster-dhe-prone/",
    "MSH": "https://gjakova.rks-gov.net/staff/drejtoria-per-mbrojtje-dhe-shpetim/",
    "INS": "https://gjakova.rks-gov.net/staff/drejtoria-per-pune-inspektuese/",
}

SERVICE_URLS: dict[str, list[str]] = {
    "ADM": ["https://gjakova.rks-gov.net/sherbimet-6/"],
    "URB": ["https://gjakova.rks-gov.net/sherbimet-8/"],
    "INS": ["https://gjakova.rks-gov.net/sherbimet-9/"],
    "BUJ": ["https://gjakova.rks-gov.net/sherbimet-2/"],
    "FIN": ["https://gjakova.rks-gov.net/sherbimet/"],
}

HARD_NEGATIVE_RULES: list[dict[str, str]] = [
    {
        "pair": "URB/INS",
        "rule": (
            "Kërkesë për leje ndërtimi, kushte ndërtimore, pëlqim parcelimi, "
            "ose legalizim sipas procedurës urbane 'Ndërtime pa leje' → URB. "
            "Denoncim i ndërtimit të huaj pa leje / kërkesë për inspektim, "
            "ndalim punimesh ose rrënim → INS (Inspektorati i Ndërtimit, Neni 21)."
        ),
    },
    {
        "pair": "URB/KAD",
        "rule": (
            "Regjistrim prone, parcelë kadastrale, hipotekë, kufij, fletëposedim → KAD. "
            "Pëlqim urbanistik për parcelim për të ndërtuar, leje ndërtimi → URB. "
            "Ndarje fizike kadastrale pa qëllim urbanistik → KAD."
        ),
    },
    {
        "pair": "INF/SHP",
        "rule": (
            "Rregullorja 27.03.2025, Neni 12: rrugë, trotuare, ura, gropa, "
            "mirëmbajtje rrugore, sinjalizim, leje transporti → INF. "
            "Neni 11: parqe, gjelbërim, tregje, varreza, ndriçim publik, "
            "mbeturina, pastrim rrugësh, kafshë endacake → SHP. "
            "Faqja e stafit INF/SHP përsërit tekstin e vjetër të përbashkët; "
            "kompetenca vendoset nga rregullorja, jo nga ajo kopje."
        ),
    },
    {
        "pair": "SHP/SHS",
        "rule": (
            "Mungesë uji të pijshëm / higjienë / epidemi si masë shëndetësore → SHS "
            "(Neni 13 dhe faqja e stafit: sigurimi i ujit të sigurt). "
            "Kanalizim, ujëra të zeza, mbeturina, kontejnerë → SHP. "
            "Leje për ndërtim ujësjellësi → URB."
        ),
    },
    {
        "pair": "FIN/KAD",
        "rule": (
            "Tatim në pronë, faturë tatimi, ankesë për vlerën e faturës → FIN "
            "(Sektori për Tatimin në Pronë, Neni 10). "
            "Regjistër kadastral, hipotekë, fletëposedim → KAD."
        ),
    },
    {
        "pair": "ARS/INF",
        "rule": (
            "Bursë, regjistrim shkolle, çati/oborr shkolle, mirëmbajtje objekti arsimor → ARS "
            "(Neni 14: mirëmbajtja e ndërtesave të institucioneve arsimore). "
            "Rrugë komunale pranë shkollës, jo objekti shkollor → INF."
        ),
    },
    {
        "pair": "MSH/INS",
        "rule": (
            "Zjarr, emergjencë, vërshim, 112, zjarrfikës → MSH (Neni 20). "
            "Inspektim tregu/ndërtimi/shërbimesh pa rrezik jete → INS."
        ),
    },
    {
        "pair": "URB/ZHE/INS",
        "rule": (
            "Regjistrim biznesi, certifikatë biznesi, taksë në firmë → ZHE. "
            "Pëlqim për kioskë / objekt të përkohshëm në hapësirë publike → URB. "
            "Kioskë pa leje / gjobë tregu / mall i palejuar → INS (Inspektorati i Tregut)."
        ),
    },
]


def official_name(department_id: str) -> str:
    return DIRECTORATE_BY_ID[department_id]["official_name"]
