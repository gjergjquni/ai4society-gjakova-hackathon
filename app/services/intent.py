"""Classifier 1 — KËRKESË vs ANKESË. Separate from directorate routing."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import joblib
import numpy as np

from app.config import settings
from app.services.embeddings import embed_query, embed_texts
from app.services.preprocess import fold_for_match, normalize_albanian

COMPLAINT_CUES = (
    "ankohem",
    "ankesë",
    "vonesë",
    "vonese",
    "padrejt",
    "gabim",
    "s'kam përgjigje",
    "s'kam pergjigje",
    "ende nuk",
    "nuk po",
    "më kanë refuzuar",
    "me kane refuzuar",
    "dëmtuar",
    "demtuar",
    "gjobë",
    "nuk po më",
    "nuk po me",
    "fqinji",
    "denoncoj",
    "inspektoni",
    "pa leje",
    "ka filluar të ndërtojë",
    "ka filluar te ndertoje",
    "po ndërton",
    "po nderton",
    "gropë",
    "gropa",
    "nuk punon",
    "është dëmtuar",
    "eshte demtuar",
    "ka gropë",
    "ka grope",
)
REQUEST_CUES = (
    "dua të pajisem",
    "dua te pajisem",
    "aplikoj",
    "më duhet",
    "me duhet",
    "kërkoj leje",
    "kerkoj leje",
    "dua të regjistroj",
    "dua te regjistroj",
)


def lexical_intent_features(text: str) -> np.ndarray:
    folded = fold_for_match(text)
    c = sum(1.0 for cue in COMPLAINT_CUES if cue in folded)
    r = sum(1.0 for cue in REQUEST_CUES if cue in folded)
    return np.asarray([c, r, 1.0 if c > r else 0.0, 1.0 if r > c else 0.0], dtype=np.float32)

INTENT_LABELS = ("KËRKESË", "ANKESË")


@dataclass
class IntentPrediction:
    label: str
    score: float
    raw_score: float


class IntentClassifier:
    def __init__(self, artifacts_dir: Path | None = None) -> None:
        self.artifacts_dir = artifacts_dir or settings.artifacts_dir
        self.model = None
        self.calibrator = None
        self.loaded = False

    def load(self) -> None:
        path = self.artifacts_dir / "intent_model.joblib"
        if not path.exists():
            self.loaded = False
            return
        bundle = joblib.load(path)
        self.model = bundle["model"]
        self.calibrator = bundle.get("calibrator")
        self.loaded = True

    def predict(self, text: str) -> IntentPrediction:
        cleaned = normalize_albanian(text)
        folded = fold_for_match(cleaned)
        situation = (
            "ka gropë",
            "ka grope",
            "nuk punon",
            "po ndërton pa leje",
            "po nderton pa leje",
            "nuk kemi ujë",
            "nuk kemi uje",
            "çatia",
            "catia",
            "fqinji",
            "e gabuar",
            "fatura e tatimit",
            "po merr ujë",
            "zjarr",
            "zjarrfik",
            "112",
            "vërshim",
            "vershim",
            "ende nuk kam marrë",
            "ende nuk kam marre",
            "nuk po më",
            "nuk po me",
            "ankohem",
            "gropë",
            "gropen",
            "rregulloni",
        )
        obtain = (
            "dua të pajisem",
            "dua te pajisem",
            "aplikoj",
            "dua leje",
            "dua të regjistroj",
            "dua te regjistroj",
            "më duhet certifikat",
            "me duhet certifikat",
        )
        if any(p in folded for p in situation) and not any(p in folded for p in obtain):
            return IntentPrediction(label="ANKESË", score=0.9, raw_score=2.0)
        if self.loaded and self.model is not None:
            vector = np.hstack(
                [embed_query(cleaned), lexical_intent_features(cleaned)]
            ).reshape(1, -1)
            raw = float(self.model.decision_function(vector)[0])
            if self.calibrator is not None:
                proba = float(self.calibrator.predict_proba(np.array([[raw]]))[0][1])
            elif hasattr(self.model, "predict_proba"):
                proba = float(self.model.predict_proba(vector)[0][1])
            else:
                proba = 1.0 / (1.0 + np.exp(-raw))
            # Class 1 is ANKESË in the trained encoder.
            label = "ANKESË" if proba >= 0.5 else "KËRKESË"
            confidence = proba if label == "ANKESË" else 1.0 - proba
            return IntentPrediction(label=label, score=float(confidence), raw_score=raw)
        return self._fallback(cleaned)

    def _fallback(self, text: str) -> IntentPrediction:
        """Used only before artifacts exist (e.g. dataset generation). Not the product path."""
        vector = embed_texts([text], kind="query")[0]
        complaint = embed_texts(
            [
                "ankesë për vonesë, gabim, padrejtësi, dëmtim, mungesë përgjigjeje, shkelje"
            ],
            kind="passage",
        )[0]
        request = embed_texts(
            ["kërkesë për t'u pajisur me dokument, leje, shërbim, regjistrim, aplikim"],
            kind="passage",
        )[0]
        c = float(np.dot(vector, complaint))
        r = float(np.dot(vector, request))
        if c > r:
            return IntentPrediction("ANKESË", score=c, raw_score=c - r)
        return IntentPrediction("KËRKESË", score=r, raw_score=r - c)
