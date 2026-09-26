from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ClassifyRequest(BaseModel):
    text: str = Field(min_length=3)
    location_text: str | None = None
    lat: float | None = None
    lon: float | None = None
    citizen_ref: str | None = None


class EvidenceOut(BaseModel):
    kind: Literal["official_procedure", "official_responsibility"]
    id: str
    text: str
    source_url: str


class DuplicateSignalsOut(BaseModel):
    text: float
    location: float
    department: float
    time: float
    entities: float = 0.0


class DuplicateOut(BaseModel):
    decision: Literal["NEW_CASE", "MERGED_INTO_EXISTING_PROBLEM"]
    problem_id: str | None = None
    score: float
    signals: DuplicateSignalsOut


class ProblemOut(BaseModel):
    id: str
    title: str
    department_id: str | None = None
    location_text: str | None = None
    status: str
    report_count: int
    first_reported_at: datetime | None = None
    last_reported_at: datetime | None = None


class ClassifyResponse(BaseModel):
    report_id: str
    type: Literal["KËRKESË", "ANKESË"]
    procedure_id: str
    procedure: str
    department_id: str
    department: str
    confidence: float
    evidence: list[EvidenceOut]
    duplicate: DuplicateOut
    problem: ProblemOut
    status: Literal["ROUTED"]
    kb_version: str
    model_version: str


class ReportCreate(BaseModel):
    text: str = Field(min_length=3)
    location_text: str | None = None
    lat: float | None = None
    lon: float | None = None
    citizen_ref: str | None = None


class ReportOut(BaseModel):
    id: str
    created_at: datetime
    text: str
    location_text: str | None
    lat: float | None
    lon: float | None
    intent: str
    department_id: str
    department: str
    procedure_id: str
    confidence: float
    problem_id: str
    kb_version: str
    model_version: str
    evidence: list[EvidenceOut]
    status: str


class FeedbackIn(BaseModel):
    report_id: str
    predicted_department_id: str
    correct_department_id: str
    predicted_intent: str | None = None
    correct_intent: str | None = None
    note: str | None = None


class FeedbackOut(BaseModel):
    id: str
    stored: bool
    auto_retrained: bool = False
    message: str


class HealthOut(BaseModel):
    status: str
    kb_version: str
    model_version: str
    directorates: int
    models_loaded: bool


class TaxonomyOut(BaseModel):
    version: str
    kb_version: str
    directorates: list[dict]
    hard_negative_rules: list[dict]
    mapping_rule: str
    confidence_note: str
