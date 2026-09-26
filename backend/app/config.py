from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{DATA_DIR / 'pulsi.db'}"
)

DUPLICATE_DAYS = int(os.getenv("DUPLICATE_DAYS", "30"))
DUPLICATE_DISTANCE_METERS = float(os.getenv("DUPLICATE_DISTANCE_METERS", "120"))
