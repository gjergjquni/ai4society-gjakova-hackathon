from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.config import settings  # noqa: E402


def artifacts_ready() -> bool:
    return (settings.artifacts_dir / "department_index.npz").exists() and (
        settings.artifacts_dir / "intent_model.joblib"
    ).exists()


requires_models = pytest.mark.skipif(
    not artifacts_ready(),
    reason="Train artifacts first: python scripts/train_intent.py && python scripts/train_department.py",
)
