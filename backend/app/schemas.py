from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator

CategoryId = Literal["pothole", "waste", "light", "water", "sidewalk", "traffic"]
PlaceId = Literal["sheshi", "qender", "carshia", "spitali", "ura", "cabrati"]
PublicStatus = Literal["Eskaluar", "Në shqyrtim", "Monitorim"]


class ReportCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    category_id: CategoryId | None = None
    custom_text: str = Field(default="", max_length=1000)
    place_id: PlaceId | None = None
    has_photo: bool = False

    @model_validator(mode="after")
    def require_subject(self):
        if self.category_id is None and not self.custom_text:
            raise ValueError("category_id or custom_text is required")
        return self


class Reason(BaseModel):
    label: str
    value: int


class Coords(BaseModel):
    lat: float
    lng: float


class IssueResponse(BaseModel):
    id: str
    rank: int
    title: str
    category: str
    categoryId: str
    location: str
    reports: int
    priority: int
    trend: int
    severity: str
    status: str
    department: str
    age: str
    impact: str
    recommendation: str
    reasons: list[Reason]
    coords: Coords | None
    color: str


class ReportResult(BaseModel):
    report_id: str
    problem_id: str
    case_code: str
    created_at: datetime
    category: str
    category_id: str
    location_text: str
    lat: float | None
    lon: float | None
    department_id: str
    department_name: str
    duplicate_decision: str
    duplicate_score: float
    location_match: bool
    has_photo: bool
    issue: IssueResponse


class ProblemStatusUpdate(BaseModel):
    status: PublicStatus
