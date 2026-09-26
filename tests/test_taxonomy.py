from __future__ import annotations

from app.services.kb import load_kb
from app.taxonomy import DIRECTORATES, official_name


def test_exactly_13_directorates() -> None:
    assert len(DIRECTORATES) == 13
    ids = [d["id"] for d in DIRECTORATES]
    assert ids == [
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
    ]
    assert "INS" in ids
    assert official_name("URB") == "Drejtoria për Urbanizëm dhe Mbrojtje të Mjedisit"


def test_kb_nonempty_with_sources() -> None:
    kb = load_kb()
    assert len(kb.departments) == 13
    for dept_id, rec in kb.departments.items():
        assert rec["responsibilities"], dept_id
        assert rec["procedures"], dept_id
        for item in rec["responsibilities"]:
            assert item["source_url"]
            assert item["text"]
        for item in rec["procedures"]:
            assert item["source_url"]
            assert item["name"]
    urb = kb.departments["URB"]
    names = [p["name"] for p in urb["procedures"]]
    assert any("Leje Ndërtimi" == n for n in names)
    assert any("Pëlqim për Parcelim" in n for n in names)
    assert any("Ndërtime pa leje" in n for n in names)
    assert len(urb["procedures"]) == 20
