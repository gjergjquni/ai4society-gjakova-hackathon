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

# Ids match the citizen form. Labels stay Albanian so stored cases do not
# change when the page language changes.
CATEGORIES = {
    "pothole": CategoryRoute("Gropë", "SHP", "Drejtoria e Shërbimeve Publike", "#ff9f43"),
    "waste": CategoryRoute("Mbeturina", "CAB", "Çabrati Sh.A.", "#d6f36a"),
    "light": CategoryRoute("Ndriçim", "INF", "Drejtoria e Infrastrukturës", "#8f7cff"),
    "water": CategoryRoute("Rrjedhje uji", "KRU", "KRU Gjakova", "#ff5e66"),
    "sidewalk": CategoryRoute("Trotuar", "SHP", "Drejtoria e Shërbimeve Publike", "#65e4ff"),
    "traffic": CategoryRoute("Trafik", "SHP", "Drejtoria e Shërbimeve Publike", "#65e4ff"),
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
