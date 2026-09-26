from __future__ import annotations

from app.services.preprocess import fold_for_match, normalize_albanian, tokens


def test_whitespace_and_quotes() -> None:
    assert normalize_albanian('  «leje»   ndërtimi\n') == '"leje" ndërtimi'


def test_gheg_fold() -> None:
    folded = fold_for_match("Ka nje grop ne rrugen e Pejes")
    assert "gropë" in folded or "grop" in folded
    assert tokens("Dua certifikatë lindjeje")
