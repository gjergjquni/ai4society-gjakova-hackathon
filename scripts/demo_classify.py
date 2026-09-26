"""End-to-end demo: 15 Gjakova reports including hard pairs and 3 pothole duplicates."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.db import SessionLocal, init_db  # noqa: E402
from app.schemas import ClassifyRequest  # noqa: E402
from app.seed import seed_open_problems  # noqa: E402
from app.services.case_engine import CaseEngine  # noqa: E402
from app.services.department import DepartmentClassifier  # noqa: E402
from app.services.duplicate import DuplicateDetector  # noqa: E402
from app.services.intent import IntentClassifier  # noqa: E402
from app.services.kb import load_kb  # noqa: E402

CASES = [
    {
        "text": "Dua të pajisem me leje ndërtimi për shtëpinë time.",
        "location_text": "Çabrati",
        "expect_type": "KËRKESË",
        "expect_dept": "URB",
    },
    {
        "text": "Komuna nuk po më jep përgjigje për lejen e ndërtimit që e kam dorëzuar para dy muajsh.",
        "location_text": "Çabrati",
        "expect_type": "ANKESË",
        "expect_dept": "URB",
    },
    {
        "text": "Fqinji im ka filluar të ndërtojë një shtëpi pa leje ndërtimi.",
        "location_text": "te xhamia Hadum",
        "expect_type": "ANKESË",
        "expect_dept": "INS",
    },
    {
        "text": "Dua të regjistroj parcelën.",
        "location_text": "Bec",
        "expect_type": "KËRKESË",
        "expect_dept": "KAD",
    },
    {
        "text": "Dua të ndaj parcelën për të ndërtuar.",
        "location_text": "Bec",
        "expect_type": "KËRKESË",
        "expect_dept": "URB",
    },
    {
        "text": "Ka një gropë të madhe në rrugën e Pejës.",
        "location_text": "Rruga e Pejës",
        "lat": 42.3805,
        "lon": 20.4308,
        "expect_type": "ANKESË",
        "expect_dept": "INF",
    },
    {
        "text": "Rruga e Pejës është dëmtuar dhe ka një gropë.",
        "location_text": "Rruga e Pejës, Gjakovë",
        "lat": 42.38055,
        "lon": 20.43085,
        "expect_type": "ANKESË",
        "expect_dept": "INF",
    },
    {
        "text": "Ju lutem rregulloni gropën te rruga e Pejës.",
        "location_text": "Rruga e Pejës",
        "lat": 42.3806,
        "lon": 20.4309,
        "expect_type": "ANKESË",
        "expect_dept": "INF",
    },
    {
        "text": "Ka gropë në rrugën e Prizrenit.",
        "location_text": "Rruga e Prizrenit",
        "expect_type": "ANKESË",
        "expect_dept": "INF",
    },
    {
        "text": "Ndriçimi publik nuk punon në Lagjen e Re.",
        "location_text": "Lagjja e Re",
        "expect_type": "ANKESË",
        "expect_dept": "SHP",
    },
    {
        "text": "Nuk kemi ujë në lagje.",
        "location_text": "Lagjja e Re",
        "expect_type": "ANKESË",
        "expect_dept": "SHS",
    },
    {
        "text": "Dua të aplikoj për subvencion për bujqësi.",
        "location_text": "Molliq",
        "expect_type": "KËRKESË",
        "expect_dept": "BUJ",
    },
    {
        "text": "Kam aplikuar për subvencion por ende nuk kam marrë përgjigje.",
        "location_text": "Molliq",
        "expect_type": "ANKESË",
        "expect_dept": "BUJ",
    },
    {
        "text": "Ka zjarr te shtëpia, dërgoni zjarrfikësit.",
        "location_text": "Smolicë",
        "expect_type": "ANKESË",
        "expect_dept": "MSH",
    },
    {
        "text": "Dua certifikatë lindjeje.",
        "location_text": "Gjakovë",
        "expect_type": "KËRKESË",
        "expect_dept": "ADM",
    },
]


def main() -> None:
    from app.config import settings

    db_path = settings.data_dir / "gjakova_cases.db"
    if db_path.exists():
        db_path.unlink()
    init_db()
    kb = load_kb()
    intent = IntentClassifier()
    intent.load()
    department = DepartmentClassifier(kb=kb)
    department.load()
    if not department.loaded:
        raise SystemExit("Train models first.")
    engine = CaseEngine(intent, department, DuplicateDetector())
    session = SessionLocal()
    seed_open_problems(session)
    session.commit()
    print("=== demo_classify — 15 Gjakova reports ===\n")
    ok = 0
    for i, case in enumerate(CASES, start=1):
        payload = ClassifyRequest(
            text=case["text"],
            location_text=case.get("location_text"),
            lat=case.get("lat"),
            lon=case.get("lon"),
        )
        result = engine.classify(session, payload)
        session.commit()
        type_ok = result.type == case["expect_type"]
        dept_ok = result.department_id == case["expect_dept"]
        flag = "OK" if type_ok and dept_ok else "MISS"
        if type_ok and dept_ok:
            ok += 1
        ev = result.evidence[0] if result.evidence else None
        print(f"{i:02d} [{flag}] {result.type} / {result.department_id}  conf={result.confidence:.2f}")
        print(f"    {case['text']}")
        print(f"    procedure={result.procedure_id} {result.procedure}")
        if ev:
            print(f"    evidence={ev.id} {ev.source_url}")
        print(f"    duplicate={result.duplicate.decision} problem={result.problem.id} n={result.problem.report_count}")
        print()
    print(f"{ok}/{len(CASES)} matched expected type+directorate.")
    session.close()


if __name__ == "__main__":
    main()
