"""Local multilingual embeddings. No paid API on the hot path."""

from __future__ import annotations

from functools import lru_cache
from typing import Sequence

import numpy as np

from app.config import settings


@lru_cache(maxsize=1)
def get_model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(settings.embedding_model)


def _prefixed(texts: Sequence[str], kind: str) -> list[str]:
    # e5 models expect query:/passage: prefixes.
    prefix = "query: " if kind == "query" else "passage: "
    return [prefix + (t or "") for t in texts]


def embed_texts(texts: Sequence[str], kind: str = "passage") -> np.ndarray:
    model = get_model()
    vectors = model.encode(
        _prefixed(texts, kind),
        normalize_embeddings=True,
        show_progress_bar=False,
    )
    return np.asarray(vectors, dtype=np.float32)


def embed_query(text: str) -> np.ndarray:
    return embed_texts([text], kind="query")[0]


def cosine(a: np.ndarray, b: np.ndarray) -> float:
    denom = float(np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)
