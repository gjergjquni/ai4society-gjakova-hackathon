"""Albanian / Gheg / administrative text cleanup."""

from __future__ import annotations

import re
import unicodedata

QUOTE_MAP = {
    "«": '"',
    "»": '"',
    "“": '"',
    "”": '"',
    "‘": "'",
    "’": "'",
    "`": "'",
}

# Common Kosovo/Gheg surface variants → standard Albanian for matching.
GHEG_VARIANTS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bkomuna s'?(\w)", re.I), r"komuna \1"),
    (re.compile(r"\bmu kqyr\b", re.I), "më shiko"),
    (re.compile(r"\bpo don\b", re.I), "dua"),
    (re.compile(r"\bboni\b", re.I), "bëni"),
    (re.compile(r"\bbona\b", re.I), "bëra"),
    (re.compile(r"\bshtie\b", re.I), "shtëpi"),
    (re.compile(r"\bshtpia\b", re.I), "shtëpia"),
    (re.compile(r"\brrugen\b", re.I), "rrugën"),
    (re.compile(r"\brrugen\b", re.I), "rrugën"),
    (re.compile(r"\bgrop\b", re.I), "gropë"),
    (re.compile(r"\bujt\b", re.I), "ujët"),
    (re.compile(r"\bnuk ka uj[ëe]?\b", re.I), "nuk ka ujë"),
    (re.compile(r"\blej[eë] n[d]ertimi\b", re.I), "leje ndërtimi"),
    (re.compile(r"\bndertim\b", re.I), "ndërtim"),
    (re.compile(r"\bnderton\b", re.I), "ndërton"),
    (re.compile(r"\bcertifikat[eë]\b", re.I), "certifikatë"),
    (re.compile(r"\bankes[eë]\b", re.I), "ankesë"),
    (re.compile(r"\bkerkes[eë]\b", re.I), "kërkesë"),
]


def normalize_albanian(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFC", text)
    for src, dst in QUOTE_MAP.items():
        text = text.replace(src, dst)
    text = text.replace("\u00a0", " ").replace("\u200b", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\s*\n\s*", "\n", text)
    text = text.strip()
    return text


def fold_for_match(text: str) -> str:
    """Lowercase + Gheg folding used by lexical overlap, not as a keyword classifier."""
    folded = normalize_albanian(text).lower()
    for pattern, repl in GHEG_VARIANTS:
        folded = pattern.sub(repl, folded)
    folded = re.sub(r"[^\wëç\s-]", " ", folded, flags=re.UNICODE)
    folded = re.sub(r"\s+", " ", folded).strip()
    return folded


def tokens(text: str) -> list[str]:
    return [t for t in fold_for_match(text).split() if len(t) > 1]


def lexical_overlap(a: str, b: str) -> float:
    sa, sb = set(tokens(a)), set(tokens(b))
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)
