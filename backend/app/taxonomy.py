from dataclasses import dataclass


@dataclass(frozen=True)
class Place:
    label: str
    lat: float
    lon: float


@dataclass(frozen=True)
class CategoryRoute:
    label: str
    department_id: str
    department_name: str
    color: str


UNSPECIFIED_LOCATION = "Lokacion i pacaktuar"
CUSTOM_CATEGORY_ID = "custom"
CUSTOM_CATEGORY_LABEL = "Kërkesë e personalizuar"
NEW_ISSUE_COLOR = "#65e4ff"
ACTIVE_STATUSES = ("Eskaluar", "Në shqyrtim", "Monitorim")

DIRECTORATE_IDS = (
    "ADM",
    "FIN",
    "SHP",
    "INF",
    "SHS",
    "ARS",
    "KRS",
    "ZHE",
    "URB",
    "BUJ",
    "KAD",
    "MSH",
    "INS",
)

DIRECTORATES = {
    "ADM": "Drejtoria e Administratës",
    "FIN": "Drejtoria për Buxhet dhe Financa",
    "SHP": "Drejtoria për Shërbime Publike",
    "INF": "Drejtoria për Infrastrukturë",
    "SHS": "Drejtoria për Shëndetësi dhe Mirëqenie Sociale",
    "ARS": "Drejtoria për Arsim",
    "KRS": "Drejtoria për Kulturë, Rini dhe Sport",
    "ZHE": "Drejtoria për Zhvillim Ekonomik",
    "URB": "Drejtoria për Urbanizëm dhe Mbrojtje të Mjedisit",
    "BUJ": "Drejtoria për Bujqësi, Pylltari dhe Zhvillim Rural",
    "KAD": "Drejtoria për Gjeodezi, Kadastër dhe Pronë",
    "MSH": "Drejtoria për Mbrojtje dhe Shpëtim",
    "INS": "Drejtoria për Inspektime",
}

WORKFLOW_STATUSES = (
    "SUBMITTED",
    "AI_ANALYZED",
    "PENDING_REVIEW",
    "APPROVED",
    "REJECTED",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "VERIFIED",
    "CLOSED",
)

REVIEW_STATUSES = ("SUBMITTED", "AI_ANALYZED", "PENDING_REVIEW")
ASSIGNED_STATUSES = ("ASSIGNED", "IN_PROGRESS", "RESOLVED", "VERIFIED", "CLOSED")
PRIORITY_LABELS = ("Kritike", "E lartë", "Mesatare", "E ulët")

# Citizen form ids → official 13 directorates (ADM…INS).
CATEGORIES = {
    "pothole": CategoryRoute("Gropë", "INF", "Drejtoria për Infrastrukturë", "#ff9f43"),
    "waste": CategoryRoute("Mbeturina", "SHP", "Drejtoria për Shërbime Publike", "#d6f36a"),
    "light": CategoryRoute("Ndriçim", "SHP", "Drejtoria për Shërbime Publike", "#8f7cff"),
    "water": CategoryRoute("Rrjedhje uji", "SHS", "Drejtoria për Shëndetësi dhe Mirëqenie Sociale", "#ff5e66"),
    "sidewalk": CategoryRoute("Trotuar", "INF", "Drejtoria për Infrastrukturë", "#65e4ff"),
    "traffic": CategoryRoute("Trafik", "INF", "Drejtoria për Infrastrukturë", "#65e4ff"),
}

CATEGORY_LABELS = {
    "pothole": "Infrastrukturë",
    "waste": "Mbeturina",
    "light": "Ndriçim",
    "water": "Ujësjellës",
    "sidewalk": "Trotuar",
    "traffic": "Trafik",
    "custom": "Ambient",
}

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

SECTOR_BY_CATEGORY = {
    "pothole": "Mirëmbajtja e rrugëve",
    "waste": "Menaxhimi i mbeturinave",
    "light": "Ndriçimi publik",
    "water": "Rrjeti i ujësjellësit",
    "sidewalk": "Mirëmbajtja e rrugëve",
    "traffic": "Sinjalizimi rrugor",
    "custom": "Hapësirat publike",
}

PLACES = {
    "sheshi": Place("Sheshi i Gjakovës", 42.3806, 20.4312),
    "qender": Place("Rr. Nënë Tereza", 42.3801, 20.4304),
    "carshia": Place("Çarshia e Madhe", 42.3809, 20.4272),
    "spitali": Place("Pranë Spitalit", 42.3854, 20.4276),
    "ura": Place("Ura e Terzive", 42.3724, 20.4308),
    "cabrati": Place("Çabrati", 42.3878, 20.4198),
}

NEW_REASONS = [
    {"label": "Sinjal i ri", "value": 18},
    {"label": "Lokacioni", "value": 16},
    {"label": "Kategoria", "value": 12},
    {"label": "Kohëzgjatja", "value": 6},
]


def get_category(category_id: str) -> CategoryRoute:
    try:
        return CATEGORIES[category_id]
    except KeyError as exc:
        raise ValueError(f"Unsupported category: {category_id}") from exc


def get_place(place_id: str | None) -> Place | None:
    if place_id is None:
        return None
    try:
        return PLACES[place_id]
    except KeyError as exc:
        raise ValueError(f"Unsupported place: {place_id}") from exc


def official_directorate_id(department_id: str | None) -> str:
    aliases = {
        "CAB": "SHP",
        "KRU": "SHS",
    }
    candidate = aliases.get(department_id or "", department_id or "SHP")
    if candidate not in DIRECTORATES:
        return "SHP"
    return candidate


def directorate_name(directorate_id: str) -> str:
    return DIRECTORATES.get(official_directorate_id(directorate_id), DIRECTORATES["SHP"])


def ui_status(workflow_status: str) -> str:
    return {
        "SUBMITTED": "SUBMITTED",
        "AI_ANALYZED": "AI_ANALYZED",
        "PENDING_REVIEW": "NE_SHQYRTIM",
        "APPROVED": "APROVUAR",
        "REJECTED": "REFUZUAR",
        "ASSIGNED": "DERGUAR_TE_DREJTORIA",
        "IN_PROGRESS": "DERGUAR_TE_DREJTORIA",
        "RESOLVED": "DERGUAR_TE_DREJTORIA",
        "VERIFIED": "DERGUAR_TE_DREJTORIA",
        "CLOSED": "DERGUAR_TE_DREJTORIA",
    }.get(workflow_status, "NE_SHQYRTIM")


def ui_directorate_status(workflow_status: str) -> str | None:
    return {
        "ASSIGNED": "NEW",
        "IN_PROGRESS": "IN_PROGRESS",
        "RESOLVED": "RESOLVED",
        "VERIFIED": "VERIFIED",
        "CLOSED": "CLOSED",
    }.get(workflow_status)


def citizen_status_label(workflow_status: str) -> str:
    return {
        "SUBMITTED": "Në shqyrtim",
        "AI_ANALYZED": "Në shqyrtim",
        "PENDING_REVIEW": "Në shqyrtim",
        "APPROVED": "Aprovuar",
        "REJECTED": "Refuzuar",
        "ASSIGNED": "Te drejtoria",
        "IN_PROGRESS": "Në proces",
        "RESOLVED": "E zgjidhur",
        "VERIFIED": "E verifikuar",
        "CLOSED": "E mbyllur",
    }.get(workflow_status, "Në shqyrtim")


def timeline_for(workflow_status: str) -> list[str]:
    steps = [
        ("SUBMITTED", "Raportuar"),
        ("AI_ANALYZED", "Analizuar nga AI"),
        ("PENDING_REVIEW", "Në shqyrtim"),
        ("APPROVED", "Verifikuar nga Arkivisti"),
        ("ASSIGNED", "Dërguar te Drejtoria"),
        ("IN_PROGRESS", "Në proces"),
        ("RESOLVED", "Zgjidhur"),
        ("VERIFIED", "Verifikuar"),
        ("CLOSED", "Mbyllur"),
    ]
    if workflow_status == "REJECTED":
        return ["Raportuar", "Analizuar nga AI", "Në shqyrtim", "Refuzuar"]
    reached = []
    for key, label in steps:
        reached.append(label)
        if key == workflow_status:
            break
        if workflow_status == "APPROVED" and key == "APPROVED":
            break
    if workflow_status == "ASSIGNED" and "Dërguar te Drejtoria" not in reached:
        reached.append("Dërguar te Drejtoria")
    return reached or ["Raportuar"]
