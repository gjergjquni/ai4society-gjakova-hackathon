from __future__ import annotations

from tests.conftest import requires_models


HARD = [
    ("Dua të pajisem me leje ndërtimi për shtëpinë time.", "KËRKESË", "URB"),
    (
        "Komuna nuk po më jep përgjigje për lejen e ndërtimit që e kam dorëzuar para dy muajsh.",
        "ANKESË",
        "URB",
    ),
    ("Dua të aplikoj për subvencion për bujqësi.", "KËRKESË", "BUJ"),
    ("Kam aplikuar për subvencion por ende nuk kam marrë përgjigje.", "ANKESË", "BUJ"),
    ("Fqinji im ka filluar të ndërtojë një shtëpi pa leje ndërtimi.", "ANKESË", "INS"),
    ("Dua të regjistroj parcelën.", "KËRKESË", "KAD"),
    ("Dua të ndaj parcelën për të ndërtuar.", "KËRKESË", "URB"),
    ("Ka gropë të madhe në rrugën e Pejës.", "ANKESË", "INF"),
    ("Ndriçimi publik nuk punon.", "ANKESË", "SHP"),
    ("Nuk kemi ujë në lagje.", "ANKESË", "SHS"),
    ("Dua certifikatë lindjeje.", "KËRKESË", "ADM"),
    ("Fatura e tatimit në pronë është e gabuar.", "ANKESË", "FIN"),
    ("Çatia e shkollës po merr ujë.", "ANKESË", "ARS"),
    ("Ka zjarr, dërgoni zjarrfikësit.", "ANKESË", "MSH"),
    ("Dua të regjistroj një biznes të ri.", "KËRKESË", "ZHE"),
]


@requires_models
def test_hard_pairs_intent_and_one_directorate() -> None:
    from app.services.department import DepartmentClassifier
    from app.services.intent import IntentClassifier

    intent = IntentClassifier()
    intent.load()
    dept = DepartmentClassifier()
    dept.load()
    assert intent.loaded and dept.loaded
    for text, exp_intent, exp_dept in HARD:
        got_i = intent.predict(text)
        got_d = dept.predict(text)
        assert got_i.label == exp_intent, f"{text} -> {got_i.label} != {exp_intent}"
        assert got_d.department_id == exp_dept, f"{text} -> {got_d.department_id} != {exp_dept}"
        assert got_d.department.startswith("Drejtoria")
        assert len(got_d.evidence) >= 1
        assert got_d.evidence[0].source_url
