from __future__ import annotations

from app.services.department import DepartmentPrediction
from app.taxonomy import official_name


def test_prediction_always_one_official_name() -> None:
    pred = DepartmentPrediction(
        procedure_id="URB-01",
        procedure="Leje Ndërtimi",
        department_id="URB",
        department=official_name("URB"),
        confidence=0.9,
        raw_score=1.0,
    )
    assert pred.department == "Drejtoria për Urbanizëm dhe Mbrojtje të Mjedisit"
    assert pred.department_id == "URB"


def test_deterministic_map_ids() -> None:
    mapping = {
        "URB-01": "URB",
        "INS-02": "INS",
        "KAD-01": "KAD",
        "INF-01": "INF",
        "SHP-01": "SHP",
        "FIN-02": "FIN",
        "ADM-01": "ADM",
        "MSH-02": "MSH",
        "BUJ-02": "BUJ",
        "ARS-02": "ARS",
        "ZHE-01": "ZHE",
        "SHS-05": "SHS",
        "KRS-01": "KRS",
    }
    for proc_id, dept in mapping.items():
        assert proc_id.startswith(dept)
        assert official_name(dept)
