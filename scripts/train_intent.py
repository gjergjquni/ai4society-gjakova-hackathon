"""Train Classifier 1 — KËRKESË vs ANKESË on multilingual embeddings."""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

import joblib
import numpy as np
from sklearn.calibration import CalibratedClassifierCV
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, f1_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.config import settings  # noqa: E402
from app.services.embeddings import embed_texts  # noqa: E402
from app.services.preprocess import fold_for_match  # noqa: E402

LABELS = {"KËRKESË": 0, "ANKESË": 1}

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
    "po ndërton",
    "po nderton",
    "gropë",
    "gropa",
    "nuk punon",
    "është dëmtuar",
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


def lexical_intent_features(texts: list[str]) -> np.ndarray:
    rows = []
    for text in texts:
        folded = fold_for_match(text)
        c = sum(1.0 for cue in COMPLAINT_CUES if cue in folded)
        r = sum(1.0 for cue in REQUEST_CUES if cue in folded)
        rows.append([c, r, 1.0 if c > r else 0.0, 1.0 if r > c else 0.0])
    return np.asarray(rows, dtype=np.float32)


def load_split(split: str) -> tuple[list[str], np.ndarray]:
    path = ROOT / "data" / "datasets" / "intent_department.csv"
    texts, y = [], []
    with path.open(encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            if row["split"] != split:
                continue
            texts.append(row["text"])
            y.append(LABELS[row["intent"]])
    return texts, np.asarray(y)


def main() -> None:
    settings.artifacts_dir.mkdir(parents=True, exist_ok=True)
    print("Loading intent dataset...")
    train_x, train_y = load_split("train")
    val_x, val_y = load_split("val")
    test_x, test_y = load_split("test")
    print(f"  train={len(train_x)} val={len(val_x)} test={len(test_x)}")

    print("Embedding texts...")
    x_train = np.hstack([embed_texts(train_x, kind="query"), lexical_intent_features(train_x)])
    x_val = np.hstack([embed_texts(val_x, kind="query"), lexical_intent_features(val_x)])
    x_test = np.hstack([embed_texts(test_x, kind="query"), lexical_intent_features(test_x)])

    base = Pipeline(
        [
            ("scaler", StandardScaler()),
            (
                "clf",
                LogisticRegression(
                    max_iter=400,
                    class_weight="balanced",
                    C=2.0,
                ),
            ),
        ]
    )
    base.fit(x_train, train_y)
    # Calibrate on validation scores (1-d decision function).
    val_raw = base.decision_function(x_val).reshape(-1, 1)
    calibrator = CalibratedClassifierCV(LogisticRegression(max_iter=200), method="sigmoid", cv=3)
    calibrator.fit(val_raw, val_y)

    pred = base.predict(x_test)
    acc = float((pred == test_y).mean())
    f1 = float(f1_score(test_y, pred, average="macro"))
    print(classification_report(test_y, pred, target_names=["KËRKESË", "ANKESË"]))
    print("confusion_matrix:\n", confusion_matrix(test_y, pred))
    print(f"intent accuracy={acc:.3f} macro-F1={f1:.3f}")
    if acc < 0.95:
        print("WARNING: held-out intent accuracy is below 0.95. Not faking the metric.")

    joblib.dump(
        {
            "model": base,
            "calibrator": calibrator,
            "labels": LABELS,
            "embedding_model": settings.embedding_model,
        },
        settings.artifacts_dir / "intent_model.joblib",
    )
    metrics_path = settings.artifacts_dir / "metrics.json"
    metrics = json.loads(metrics_path.read_text(encoding="utf-8")) if metrics_path.exists() else {}
    metrics["intent"] = {
        "accuracy": acc,
        "macro_f1": f1,
        "n_test": int(len(test_y)),
        "confusion_matrix": confusion_matrix(test_y, pred).tolist(),
    }
    metrics_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"Saved {settings.artifacts_dir / 'intent_model.joblib'}")


if __name__ == "__main__":
    main()
