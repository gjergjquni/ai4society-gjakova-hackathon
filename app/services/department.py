"""Classifier 2 — retrieve official procedures/responsibilities, then map to one directorate."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

import joblib
import numpy as np

from app.config import settings
from app.services.embeddings import cosine, embed_query
from app.services.kb import KnowledgeBase, KnowledgeItem, load_kb
from app.services.preprocess import lexical_overlap, normalize_albanian
from app.services.preprocess import fold_for_match
from app.services.rules import ILLEGAL_OTHER, rule_boosts
from app.taxonomy import official_name

TOP_K = 8
CLOSE_MARGIN = 0.08


@dataclass
class Evidence:
    kind: str
    id: str
    text: str
    source_url: str


@dataclass
class DepartmentPrediction:
    procedure_id: str
    procedure: str
    department_id: str
    department: str
    confidence: float
    raw_score: float
    evidence: list[Evidence] = field(default_factory=list)
    needs_review: bool = False
    kb_version: str = ""


def candidate_features(query: str, item: KnowledgeItem, similarity: float) -> list[float]:
    lex = lexical_overlap(query, item.search_text)
    boost = rule_boosts(query, item)
    is_proc = 1.0 if item.kind == "official_procedure" else 0.0
    return [similarity, lex, boost, is_proc]


class DepartmentClassifier:
    def __init__(self, artifacts_dir: Path | None = None, kb: KnowledgeBase | None = None) -> None:
        self.artifacts_dir = artifacts_dir or settings.artifacts_dir
        self.kb = kb or load_kb()
        self.index_vectors: np.ndarray | None = None
        self.item_ids: list[str] = []
        self.reranker = None
        self.calibrator = None
        self.loaded = False

    def load(self) -> None:
        index_path = self.artifacts_dir / "department_index.npz"
        rerank_path = self.artifacts_dir / "department_reranker.joblib"
        if not index_path.exists():
            self.loaded = False
            return
        data = np.load(index_path, allow_pickle=True)
        self.index_vectors = data["vectors"]
        self.item_ids = list(data["item_ids"])
        if rerank_path.exists():
            bundle = joblib.load(rerank_path)
            self.reranker = bundle["model"]
            self.calibrator = bundle.get("calibrator")
        self.loaded = True

    def retrieve(self, text: str, k: int = TOP_K) -> list[tuple[KnowledgeItem, float]]:
        if self.index_vectors is None:
            raise RuntimeError("Department index is not loaded. Train first.")
        query = embed_query(normalize_albanian(text))
        sims = self.index_vectors @ query
        top = np.argsort(-sims)[:k]
        out: list[tuple[KnowledgeItem, float]] = []
        for idx in top:
            item = self.kb.by_id(str(self.item_ids[int(idx)]))
            out.append((item, float(sims[int(idx)])))
        return out

    def score_candidates(
        self, text: str, candidates: list[tuple[KnowledgeItem, float]]
    ) -> list[tuple[KnowledgeItem, float, list[float]]]:
        scored = []
        for item, sim in candidates:
            feats = candidate_features(text, item, sim)
            if self.reranker is not None:
                raw = float(self.reranker.decision_function([feats])[0])
            else:
                raw = 0.55 * feats[0] + 0.20 * feats[1] + 0.25 * (feats[2] / 2.0)
            scored.append((item, raw, feats))
        scored.sort(key=lambda x: x[1], reverse=True)
        folded = fold_for_match(text)
        illegal_report = any(p in folded for p in ILLEGAL_OTHER) and not any(
            p in folded for p in ("legalizoj", "legalizimi", "dua leje", "dua të pajisem", "dua te pajisem")
        )
        if any(p in folded for p in ("gropë", "grope", "gropa", "asfalt", "rruga është dëmtuar", "rruga eshte demtuar")):
            inf = [
                row
                for row in scored
                if row[0].department_id == "INF"
                and any(
                    k in fold_for_match(row[0].search_text)
                    for k in ("rrug", "sanim", "deformim", "trotuar")
                )
            ]
            if inf:
                return inf + [row for row in scored if row[0].item_id != inf[0][0].item_id]
        if illegal_report:
            ins = [row for row in scored if row[0].department_id == "INS"]
            if ins:
                return ins + [row for row in scored if row[0].department_id != "INS"]
        if ("ndriçim" in folded or "ndricim" in folded) and "publik" in folded:
            shp = [row for row in scored if row[0].department_id == "SHP"]
            if not shp:
                for item in self.kb.items_for("SHP"):
                    if "ndriçim" in fold_for_match(item.search_text) or "ndricim" in fold_for_match(item.search_text):
                        shp = [(item, 3.0, candidate_features(text, item, 0.5))]
                        break
            if shp:
                lighting = [
                    row
                    for row in shp
                    if "ndriçim" in fold_for_match(row[0].search_text)
                    or "ndricim" in fold_for_match(row[0].search_text)
                ]
                ordered = (lighting or shp)
                return ordered + [row for row in scored if row[0].department_id != "SHP"]
        if ("nuk kemi uj" in folded or "uje i pist" in folded or "ujë i pist" in folded) and "kanalizim" not in folded:
            shs = [row for row in scored if row[0].department_id == "SHS"]
            if not shs:
                for item in self.kb.items_for("SHS"):
                    blob = fold_for_match(item.search_text)
                    if "ujit" in blob or "ujë" in blob or "uje" in blob or "higjien" in blob:
                        shs = [(item, 3.0, candidate_features(text, item, 0.5))]
                        break
            if shs:
                return shs + [row for row in scored if row[0].department_id != "SHS"]
        return scored

    def predict(self, text: str) -> DepartmentPrediction:
        cleaned = normalize_albanian(text)
        candidates = self.retrieve(cleaned)
        ranked = self.score_candidates(cleaned, candidates)
        winner, raw, _feats = ranked[0]
        runner = ranked[1][1] if len(ranked) > 1 else raw - 1.0
        needs_review = abs(raw - runner) < CLOSE_MARGIN
        if self.calibrator is not None:
            confidence = float(self.calibrator.predict([raw])[0])
        else:
            confidence = 1.0 / (1.0 + np.exp(-raw))
        confidence = float(min(0.99, max(0.51, confidence)))

        evidence = [
            Evidence(
                kind=winner.kind,
                id=winner.item_id,
                text=winner.text,
                source_url=winner.source_url,
            )
        ]
        # Keep a second official excerpt only as supporting evidence of the SAME department.
        for item, _score, _f in ranked[1:]:
            if item.department_id == winner.department_id:
                evidence.append(
                    Evidence(
                        kind=item.kind,
                        id=item.item_id,
                        text=item.text,
                        source_url=item.source_url,
                    )
                )
                break

        procedure_id = winner.item_id
        procedure_name = winner.name
        if winner.kind == "official_responsibility":
            # Prefer a procedure of the same directorate when the winner is a duty.
            for item, _s, _f in ranked:
                if item.department_id == winner.department_id and item.kind == "official_procedure":
                    procedure_id = item.item_id
                    procedure_name = item.name
                    if evidence[0].id != item.item_id:
                        evidence.insert(
                            0,
                            Evidence(
                                kind=item.kind,
                                id=item.item_id,
                                text=item.text,
                                source_url=item.source_url,
                            ),
                        )
                    break

        return DepartmentPrediction(
            procedure_id=procedure_id,
            procedure=procedure_name,
            department_id=winner.department_id,
            department=official_name(winner.department_id),
            confidence=confidence,
            raw_score=raw,
            evidence=evidence[:3],
            needs_review=needs_review,
            kb_version=self.kb.version,
        )
