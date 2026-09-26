"""Load official knowledge base and build the procedure/responsibility index."""

from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from app.config import settings
from app.taxonomy import DIRECTORATE_BY_ID, official_name


@dataclass(frozen=True)
class KnowledgeItem:
    item_id: str
    kind: str  # official_procedure | official_responsibility
    name: str
    text: str
    department_id: str
    department: str
    source_url: str
    source_title: str
    retrieved_at: str | None = None

    @property
    def search_text(self) -> str:
        return f"{self.name}. {self.text}"


@dataclass(frozen=True)
class KnowledgeBase:
    version: str
    items: list[KnowledgeItem]
    departments: dict[str, dict]

    def by_id(self, item_id: str) -> KnowledgeItem:
        for item in self.items:
            if item.item_id == item_id:
                return item
        raise KeyError(item_id)

    def items_for(self, department_id: str) -> list[KnowledgeItem]:
        return [i for i in self.items if i.department_id == department_id]


def _load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def load_kb(kb_dir: str | None = None) -> KnowledgeBase:
    root = Path(kb_dir) if kb_dir else settings.kb_dir
    taxonomy = _load_json(root / "taxonomy.json")
    departments: dict[str, dict] = {}
    items: list[KnowledgeItem] = []
    for meta in taxonomy["directorates"]:
        dept = _load_json(root / "departments" / meta["file"])
        departments[dept["id"]] = dept
        dept_name = official_name(dept["id"])
        for proc in dept.get("procedures", []):
            items.append(
                KnowledgeItem(
                    item_id=proc["id"],
                    kind="official_procedure",
                    name=proc["name"],
                    text=proc.get("description") or proc["name"],
                    department_id=dept["id"],
                    department=dept_name,
                    source_url=proc.get("source_url", ""),
                    source_title=proc.get("source_title", ""),
                    retrieved_at=proc.get("retrieved_at"),
                )
            )
        for resp in dept.get("responsibilities", []):
            items.append(
                KnowledgeItem(
                    item_id=resp["id"],
                    kind="official_responsibility",
                    name=DIRECTORATE_BY_ID[dept["id"]]["short_name"],
                    text=resp["text"],
                    department_id=dept["id"],
                    department=dept_name,
                    source_url=resp.get("source_url", ""),
                    source_title=resp.get("source_title", ""),
                    retrieved_at=resp.get("retrieved_at"),
                )
            )
    if len(departments) != 13:
        raise RuntimeError(f"Expected 13 directorates, found {len(departments)}")
    empty = [d for d, rec in departments.items() if not rec.get("responsibilities")]
    if empty:
        raise RuntimeError(f"Empty responsibilities: {empty}")
    return KnowledgeBase(
        version=taxonomy.get("kb_version", "1.0.0"),
        items=items,
        departments=departments,
    )
