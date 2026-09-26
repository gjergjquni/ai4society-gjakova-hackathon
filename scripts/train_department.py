"""Train Classifier 2 — retrieve official items, then rerank to one directorate."""

from __future__ import annotations

import csv
import json
import sys
from collections import Counter
from pathlib import Path

import joblib
import numpy as np
from sklearn.isotonic import IsotonicRegression
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.config import settings  # noqa: E402
from app.services.department import candidate_features  # noqa: E402
from app.services.embeddings import embed_query, embed_texts  # noqa: E402
from app.services.kb import load_kb  # noqa: E402

TOP_K = 8


def load_rows(split: str) -> list[dict]:
    path = ROOT / "data" / "datasets" / "intent_department.csv"
    with path.open(encoding="utf-8") as fh:
        return [r for r in csv.DictReader(fh) if r["split"] == split]


def build_index(kb) -> tuple[np.ndarray, list[str]]:
    texts = [item.search_text for item in kb.items]
    vectors = embed_texts(texts, kind="passage")
    ids = [item.item_id for item in kb.items]
    return vectors, ids


def retrieve_ids(query_vec: np.ndarray, index: np.ndarray, ids: list[str], k: int = TOP_K) -> list[tuple[str, float]]:
    sims = index @ query_vec
    top = np.argsort(-sims)[:k]
    return [(ids[int(i)], float(sims[int(i)])) for i in top]


def make_pairwise(rows: list[dict], kb, index, ids) -> tuple[np.ndarray, np.ndarray]:
    X, y = [], []
    by_id = {item.item_id: item for item in kb.items}
    for row in rows:
        qv = embed_query(row["text"])
        retrieved = retrieve_ids(qv, index, ids)
        gold = row["procedure_id"]
        gold_dept = row["department_id"]
        seen_gold = any(i == gold for i, _ in retrieved)
        if not seen_gold:
            retrieved = [(gold, 0.35)] + retrieved[:-1]
        for item_id, sim in retrieved:
            item = by_id[item_id]
            feats = candidate_features(row["text"], item, sim)
            X.append(feats)
            y.append(1 if item.department_id == gold_dept else 0)
    return np.asarray(X, dtype=np.float32), np.asarray(y)


def predict_dept(text: str, gold_proc: str, kb, index, ids, reranker) -> tuple[str, str, float]:
    by_id = {item.item_id: item for item in kb.items}
    qv = embed_query(text)
    retrieved = retrieve_ids(qv, index, ids)
    scored = []
    for item_id, sim in retrieved:
        item = by_id[item_id]
        feats = candidate_features(text, item, sim)
        raw = float(reranker.decision_function([feats])[0])
        scored.append((item, raw))
    scored.sort(key=lambda x: x[1], reverse=True)
    winner = scored[0][0]
    return winner.department_id, winner.item_id, scored[0][1]


def main() -> None:
    settings.artifacts_dir.mkdir(parents=True, exist_ok=True)
    kb = load_kb()
    print(f"KB {kb.version}: {len(kb.items)} official items")
    print("Building department index...")
    index, ids = build_index(kb)
    np.savez(
        settings.artifacts_dir / "department_index.npz",
        vectors=index,
        item_ids=np.asarray(ids),
    )

    train_rows = load_rows("train")
    val_rows = load_rows("val")
    test_rows = load_rows("test")
    print("Building reranker pairs...")
    x_train, y_train = make_pairwise(train_rows, kb, index, ids)
    x_val, y_val = make_pairwise(val_rows, kb, index, ids)
    print(f"  pairs train={len(y_train)} val={len(y_val)} positives={int(y_train.sum())}")

    reranker = Pipeline(
        [
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=400, class_weight="balanced", C=1.5)),
        ]
    )
    reranker.fit(x_train, y_train)

    val_raw = reranker.decision_function(x_val)
    # Isotonic: raw score -> empirical P(correct department) computed below after dept eval.
    calibrator = IsotonicRegression(out_of_bounds="clip")
    # Temporary fit on pair labels; overwritten after department-level val scores.
    calibrator.fit(val_raw, y_val)

    def eval_rows(rows: list[dict]) -> dict:
        y_true, y_pred, raws = [], [], []
        confused: list[tuple[str, str]] = []
        for row in rows:
            pred_d, pred_p, raw = predict_dept(row["text"], row["procedure_id"], kb, index, ids, reranker)
            y_true.append(row["department_id"])
            y_pred.append(pred_d)
            raws.append(raw)
            if pred_d != row["department_id"]:
                confused.append((row["department_id"], pred_d, row["text"][:80]))
        acc = float(accuracy_score(y_true, y_pred))
        f1 = float(f1_score(y_true, y_pred, average="macro"))
        return {
            "accuracy": acc,
            "macro_f1": f1,
            "y_true": y_true,
            "y_pred": y_pred,
            "raws": raws,
            "confused": confused,
        }

    print("Evaluating department routing...")
    val_m = eval_rows(val_rows)
    test_m = eval_rows(test_rows)
    # Recalibrate: raw winner score -> empirical reliability on val.
    val_correct = np.asarray([int(a == b) for a, b in zip(val_m["y_true"], val_m["y_pred"])])
    calibrator = IsotonicRegression(out_of_bounds="clip", y_min=0.51, y_max=0.99)
    calibrator.fit(np.asarray(val_m["raws"]), val_correct)

    buckets: dict[str, list[int]] = {}
    for raw, ok in zip(val_m["raws"], val_correct):
        key = f"{int(max(0, min(9, raw + 5)))}"
        buckets.setdefault(key, []).append(int(ok))
    reliability = {k: float(np.mean(v)) for k, v in buckets.items()}

    print(f"department val acc={val_m['accuracy']:.3f} macro-F1={val_m['macro_f1']:.3f}")
    print(f"department test acc={test_m['accuracy']:.3f} macro-F1={test_m['macro_f1']:.3f}")
    pair_counts = Counter((a, b) for a, b, _t in test_m["confused"])
    print("top confused pairs (true -> pred):")
    for pair, n in pair_counts.most_common(8):
        print(f"  {pair[0]} -> {pair[1]}: {n}")
    if test_m["accuracy"] < 0.95:
        print("WARNING: held-out department accuracy is below 0.95. Reporting the real number.")
        print("Missing official text / remaining confusions:")
        for true_d, pred_d, txt in test_m["confused"][:12]:
            print(f"  {true_d}->{pred_d}: {txt}")

    joblib.dump(
        {
            "model": reranker,
            "calibrator": calibrator,
            "embedding_model": settings.embedding_model,
            "top_k": TOP_K,
        },
        settings.artifacts_dir / "department_reranker.joblib",
    )
    maps = {
        "directorates": sorted({item.department_id for item in kb.items}),
        "item_ids": ids,
        "intent_labels": ["KËRKESË", "ANKESË"],
    }
    (settings.artifacts_dir / "label_maps.json").write_text(
        json.dumps(maps, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    metrics_path = settings.artifacts_dir / "metrics.json"
    metrics = json.loads(metrics_path.read_text(encoding="utf-8")) if metrics_path.exists() else {}
    metrics["department"] = {
        "val_accuracy": val_m["accuracy"],
        "val_macro_f1": val_m["macro_f1"],
        "test_accuracy": test_m["accuracy"],
        "test_macro_f1": test_m["macro_f1"],
        "n_test": len(test_rows),
        "top_confused_pairs": [[a, b, n] for (a, b), n in pair_counts.most_common(10)],
        "calibration_reliability": reliability,
        "note": "confidence is calibrated reliability, not cosine similarity and not accuracy.",
    }
    metrics_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"Saved department index + reranker.")


if __name__ == "__main__":
    main()
