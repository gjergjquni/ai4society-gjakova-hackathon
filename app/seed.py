"""Seed OPEN problems so duplicate merge can be exercised via API without a frontend."""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Problem
from app.services.embeddings import embed_query

SEED_PROBLEMS = [
    {
        "id": "PRB-SEED01",
        "title": "Gropë në Rrugën e Pejës",
        "department_id": "INF",
        "location_text": "Rruga e Pejës, Gjakovë",
        "lat": 42.3805,
        "lon": 20.4308,
        "text": "Ka një gropë të madhe në rrugën e Pejës.",
    },
    {
        "id": "PRB-SEED02",
        "title": "Ndriçim publik i fikur në Lagjen e Re",
        "department_id": "SHP",
        "location_text": "Lagjja e Re, Gjakovë",
        "lat": 42.3850,
        "lon": 20.4280,
        "text": "Ndriçimi publik nuk punon në Lagjen e Re.",
    },
    {
        "id": "PRB-SEED03",
        "title": "Ndërtim pa leje te Xhamia Hadum",
        "department_id": "INS",
        "location_text": "te xhamia Hadum",
        "lat": 42.3792,
        "lon": 20.4301,
        "text": "Fqinji po ndërton pa leje te xhamia Hadum.",
    },
]


def seed_open_problems(session: Session) -> int:
    created = 0
    now = datetime.now(timezone.utc)
    for item in SEED_PROBLEMS:
        existing = session.get(Problem, item["id"])
        if existing:
            continue
        session.add(
            Problem(
                id=item["id"],
                title=item["title"],
                department_id=item["department_id"],
                location_text=item["location_text"],
                lat=item["lat"],
                lon=item["lon"],
                status="OPEN",
                first_reported_at=now - timedelta(days=4),
                last_reported_at=now - timedelta(days=1),
                report_count=1,
                embedding_json=json.dumps(embed_query(item["text"]).tolist()),
            )
        )
        created += 1
    session.flush()
    return created


def seed_count(session: Session) -> int:
    return len(list(session.scalars(select(Problem))))
