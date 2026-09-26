"""Calibrate duplicate-merge thresholds. False merge is worse than missed merge."""

from __future__ import annotations

import csv
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.config import settings  # noqa: E402
from app.services.duplicate import DuplicateDetector  # noqa: E402


def load_pairs(split: str | None = None) -> list[dict]:
    path = ROOT / "data" / "datasets" / "duplicate.csv"
    rows = []
    with path.open(encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            if split and row["split"] != split:
                continue
            for key in ("lat_a", "lon_a", "lat_b", "lon_b"):
                row[key] = float(row[key]) if row[key] not in ("", "None", None) else None
            row["days_apart"] = int(row["days_apart"])
            row["label"] = int(row["label"])
            rows.append(row)
    return rows


def eval_at(threshold: float, rows: list[dict], detector: DuplicateDetector) -> dict:
    now = datetime.now(timezone.utc)
    tp = fp = tn = fn = 0
    for row in rows:
        score, signals = detector.score(
            text=row["text_a"],
            location_text=row["loc_a"],
            lat=row["lat_a"],
            lon=row["lon_a"],
            department_id=row["dept_a"],
            created_at=now,
            other_text=row["text_b"],
            other_location=row["loc_b"],
            other_lat=row["lat_b"],
            other_lon=row["lon_b"],
            other_department=row["dept_b"],
            other_created_at=now - timedelta(days=row["days_apart"]),
        )
        pred = int(score >= threshold and signals.location >= 0.5)
        gold = row["label"]
        if pred == 1 and gold == 1:
            tp += 1
        elif pred == 1 and gold == 0:
            fp += 1
        elif pred == 0 and gold == 0:
            tn += 1
        else:
            fn += 1
    precision = tp / (tp + fp) if tp + fp else 1.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    # Cost: false merge (fp) is worse.
    cost = 3.0 * fp + 1.0 * fn
    return {
        "threshold": threshold,
        "precision": precision,
        "recall": recall,
        "fp": fp,
        "fn": fn,
        "tp": tp,
        "tn": tn,
        "cost": cost,
    }


def main() -> None:
    settings.artifacts_dir.mkdir(parents=True, exist_ok=True)
    train = load_pairs("train") + load_pairs("val")
    test = load_pairs("test")
    detector = DuplicateDetector()
    best = None
    for thr in [i / 100 for i in range(55, 92, 2)]:
        metrics = eval_at(thr, train, detector)
        if best is None or (metrics["precision"], -metrics["cost"], metrics["recall"]) > (
            best["precision"],
            -best["cost"],
            best["recall"],
        ):
            best = metrics
    assert best is not None
    # Prefer precision == 1.0 on train if possible.
    payload = {
        "merge_threshold": best["threshold"],
        "window_days": settings.duplicate_window_days,
        "geo_radius_m": settings.geo_radius_meters,
        "weights": detector.thresholds["weights"],
        "train_metrics": best,
        "note": "False merge is worse than missed merge. Location incompatibility blocks merge.",
    }
    (settings.artifacts_dir / "duplicate_thresholds.json").write_text(
        json.dumps(payload, indent=2), encoding="utf-8"
    )
    detector = DuplicateDetector()  # reload with new threshold
    test_m = eval_at(best["threshold"], test, detector)
    print(f"chosen merge_threshold={best['threshold']:.2f}")
    print(f"train P={best['precision']:.3f} R={best['recall']:.3f} fp={best['fp']} fn={best['fn']}")
    print(f"test  P={test_m['precision']:.3f} R={test_m['recall']:.3f} fp={test_m['fp']} fn={test_m['fn']}")
    metrics_path = settings.artifacts_dir / "metrics.json"
    metrics = json.loads(metrics_path.read_text(encoding="utf-8")) if metrics_path.exists() else {}
    metrics["duplicate"] = {
        "threshold": best["threshold"],
        "test_precision": test_m["precision"],
        "test_recall": test_m["recall"],
        "test_fp": test_m["fp"],
        "test_fn": test_m["fn"],
    }
    metrics_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
