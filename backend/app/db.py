from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from .config import DATABASE_URL

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass


REPORT_COLUMNS = {
    "workflow_status": "VARCHAR(30) DEFAULT 'PENDING_REVIEW'",
    "title": "VARCHAR(300) DEFAULT ''",
    "sector": "VARCHAR(80) DEFAULT ''",
    "priority_label": "VARCHAR(20) DEFAULT 'Mesatare'",
    "photo_url": "VARCHAR(500)",
    "neighborhood": "VARCHAR(120) DEFAULT ''",
    "citizen_name": "VARCHAR(120)",
    "directorate_status": "VARCHAR(30)",
    "rejection_reason": "TEXT",
    "merged_with_id": "VARCHAR(36)",
    "verified_by": "VARCHAR(120)",
    "resolution_json": "JSON",
    "timeline_json": "JSON",
    "ai_title": "VARCHAR(300)",
    "ai_category": "VARCHAR(80)",
    "ai_directorate_id": "VARCHAR(20)",
    "ai_sector": "VARCHAR(80)",
    "ai_priority": "VARCHAR(20)",
    "ai_summary": "TEXT",
}


def migrate_schema():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    if "reports" not in tables:
        return
    existing = {column["name"] for column in inspector.get_columns("reports")}
    with engine.begin() as connection:
        for name, ddl in REPORT_COLUMNS.items():
            if name not in existing:
                connection.execute(text(f"ALTER TABLE reports ADD COLUMN {name} {ddl}"))


def init_db():
    from . import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    migrate_schema()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
