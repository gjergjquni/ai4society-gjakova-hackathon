import re
import unicodedata

def normalize_location(value: str) -> str:
    value = value.strip().lower()
    value = unicodedata.normalize("NFKD", value)
    value = "".join(c for c in value if not unicodedata.combining(c))
    value = re.sub(r"[^\w\s]", " ", value, flags=re.UNICODE)
    value = re.sub(r"\s+", " ", value).strip()

    replacements = {
        "rr ": "rruga ",
        "r ": "rruga ",
        "sheshi": "sheshi",
    }
    for old, new in replacements.items():
        if value.startswith(old):
            value = new + value[len(old):]
    return value

def normalize_category(value: str) -> str:
    return value.strip().casefold()
