from datetime import datetime, timedelta, timezone
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Problem
from ..taxonomy import get_category


def _seed_rows() -> list[Problem]:
    now = datetime.now(timezone.utc)
    return [
        Problem(
            id=str(uuid4()),
            case_code="GJK-1042",
            category="Rrjedhje uji",
            category_id="water",
            department_id="SHS",
            department_name="Drejtoria për Shëndetësi dhe Mirëqenie Sociale",
            place_id="spitali",
            location_text="Rr. UÇK · pranë Spitalit",
            lat=42.3854,
            lon=20.4276,
            title="Rrjedhje e madhe e ujit",
            status="Eskaluar",
            severity="Kritike",
            priority=94,
            trend=12,
            impact="≈ 1,400 qytetarë",
            recommendation=(
                "Izoloni valvulën e segmentit dhe dërgoni ekipin e emergjencës. "
                "Rrjedhja është 180 m nga hyrja e spitalit dhe po prek qarkullimin."
            ),
            reasons=[
                {"label": "Siguria publike", "value": 29},
                {"label": "23 sinjale", "value": 24},
                {"label": "Lokacion kritik", "value": 23},
                {"label": "Përhapja", "value": 18},
            ],
            color=get_category("water").color,
            first_reported_at=now - timedelta(hours=2, minutes=18),
            last_reported_at=now - timedelta(minutes=20),
            report_count=23,
        ),
        Problem(
            id=str(uuid4()),
            case_code="GJK-1031",
            category="Gropë",
            category_id="pothole",
            department_id="INF",
            department_name="Drejtoria për Infrastrukturë",
            place_id="qender",
            location_text="Rr. Nënë Tereza · Qendër",
            lat=42.3801,
            lon=20.4304,
            title="Gropë e rrezikshme në rrugë",
            status="Në shqyrtim",
            severity="E lartë",
            priority=87,
            trend=8,
            impact="≈ 3,200 kalime/ditë",
            recommendation=(
                "Vendosni sinjalizim të përkohshëm sot dhe planifikoni ekipin e "
                "asfaltimit brenda 24 orëve. Raportet tregojnë rritje të shpejtë."
            ),
            reasons=[
                {"label": "Trafik i lartë", "value": 27},
                {"label": "17 sinjale", "value": 21},
                {"label": "Rrezik aksidenti", "value": 24},
                {"label": "Përsëritje", "value": 15},
            ],
            color=get_category("pothole").color,
            first_reported_at=now - timedelta(days=1, hours=4),
            last_reported_at=now - timedelta(hours=1),
            report_count=17,
        ),
        Problem(
            id=str(uuid4()),
            case_code="GJK-1019",
            category="Mbeturina",
            category_id="waste",
            department_id="SHP",
            department_name="Drejtoria për Shërbime Publike",
            place_id="ura",
            location_text="Ura e Terzive · dalje jugore",
            lat=42.3724,
            lon=20.4308,
            title="Deponi ilegale po zgjerohet",
            status="Eskaluar",
            severity="E lartë",
            priority=82,
            trend=5,
            impact="31 raportues · 4 lagje",
            recommendation=(
                "Largoni mbeturinat me mjet të rëndë, dokumentoni para/pas dhe "
                "nisni inspektim për burimin. 9 raporte të reja u bashkuan sot."
            ),
            reasons=[
                {"label": "31 sinjale", "value": 28},
                {"label": "Rritje në kohë", "value": 21},
                {"label": "Ndikim mjedisor", "value": 20},
                {"label": "Afër lumit", "value": 13},
            ],
            color=get_category("waste").color,
            first_reported_at=now - timedelta(days=3, hours=7),
            last_reported_at=now - timedelta(hours=3),
            report_count=31,
        ),
        Problem(
            id=str(uuid4()),
            case_code="GJK-1047",
            category="Ndriçim",
            category_id="light",
            department_id="SHP",
            department_name="Drejtoria për Shërbime Publike",
            place_id="carshia",
            location_text="Çarshia e Madhe",
            lat=42.3809,
            lon=20.4272,
            title="Ndriçim publik jashtë funksionit",
            status="Monitorim",
            severity="Mesatare",
            priority=71,
            trend=3,
            impact="≈ 600 këmbësorë/natë",
            recommendation=(
                "Inspektoni qarkun L-14 para muzgut. Pesë raportime përshkruajnë "
                "të njëjtin segment me 7 shtylla të fikura."
            ),
            reasons=[
                {"label": "Siguria natën", "value": 22},
                {"label": "12 sinjale", "value": 17},
                {"label": "Zonë turistike", "value": 20},
                {"label": "Kohëzgjatja", "value": 12},
            ],
            color=get_category("light").color,
            first_reported_at=now - timedelta(hours=8, minutes=42),
            last_reported_at=now - timedelta(hours=2),
            report_count=12,
        ),
    ]


def seed_demo_problems(db: Session) -> None:
    existing = db.scalar(select(Problem.id).limit(1))
    if existing:
        return

    for problem in _seed_rows():
        db.add(problem)
    db.commit()
