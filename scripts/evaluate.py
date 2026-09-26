"""Print honest held-out metrics for all three classifiers."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.config import settings  # noqa: E402


def main() -> None:
    path = settings.artifacts_dir / "metrics.json"
    if not path.exists():
        raise SystemExit("artifacts/metrics.json missing. Train first.")
    metrics = json.loads(path.read_text(encoding="utf-8"))
    print("=== Gjakova routing — held-out metrics (real, not faked) ===")
    intent = metrics.get("intent", {})
    print(
        f"Intent     acc={intent.get('accuracy', 'n/a')}  "
        f"macro-F1={intent.get('macro_f1', 'n/a')}  n={intent.get('n_test', 0)}"
    )
    if intent.get("confusion_matrix"):
        print(f"  confusion {intent['confusion_matrix']}")
    dept = metrics.get("department", {})
    print(
        f"Department acc={dept.get('test_accuracy', 'n/a')}  "
        f"macro-F1={dept.get('test_macro_f1', 'n/a')}  n={dept.get('n_test', 0)}"
    )
    print("  top confused pairs (true -> pred, count):")
    for a, b, n in dept.get("top_confused_pairs", []):
        print(f"    {a} -> {b}: {n}")
    print("  calibration reliability (score bucket -> empirical acc):")
    for k, v in sorted(dept.get("calibration_reliability", {}).items()):
        print(f"    bucket {k}: {v:.3f}")
    print("  note:", dept.get("note", ""))
    dup = metrics.get("duplicate", {})
    print(
        f"Duplicate  P={dup.get('test_precision', 'n/a')}  "
        f"R={dup.get('test_recall', 'n/a')}  "
        f"fp={dup.get('test_fp', 'n/a')} (false merge, worse)  "
        f"fn={dup.get('test_fn', 'n/a')}"
    )
    if dept.get("test_accuracy", 1) < 0.95:
        print("Department accuracy is below 0.95. See confused pairs above.")


if __name__ == "__main__":
    main()
