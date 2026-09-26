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
    lat: float | None = Field(default=None, ge=-90, le=90)
    lon: float | None = Field(default=None, ge=-180, le=180)

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


class ProblemStatusUpdate(BaseModel):
    status: PublicStatus


DirectorateId = Literal[
    "ADM", "FIN", "SHP", "INF", "SHS", "ARS", "KRS",
    "ZHE", "URB", "BUJ", "KAD", "MSH", "INS",
]
WorkflowStatus = Literal[
    "SUBMITTED",
    "AI_ANALYZED",
    "PENDING_REVIEW",
    "APPROVED",
    "REJECTED",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "VERIFIED",
    "CLOSED",
]
PriorityLabel = Literal["Kritike", "E lartë", "Mesatare", "E ulët"]
DirectorateStatus = Literal[
    "NEW", "ACCEPTED", "IN_PROGRESS", "RESOLVED", "VERIFIED", "CLOSED"
]


class AiAnalysisOut(BaseModel):
    confidence: float
    suggestedCategory: str
    suggestedPriority: str
    suggestedDirectorate: str
    reasoning: str


class ReportLocationOut(BaseModel):
    address: str
    lat: float
    lng: float
    neighborhood: str


class ResolutionOut(BaseModel):
    workDescription: str
    photoBeforeUrl: str = ""
    photoAfterUrl: str = ""
    completedAt: str


class CaseOut(BaseModel):
    id: str
    reportId: str
    title: str
    description: str
    citizenNotes: str | None = None
    category: str
    sector: str
    directorateId: str
    priority: str
    status: str
    workflowStatus: str
    directorateStatus: str | None = None
    createdAt: datetime
    date: str
    time: str
    location: ReportLocationOut
    photoUrl: str = ""
    aiAnalysis: AiAnalysisOut
    timeline: list[str]
    citizenName: str | None = None
    mergedWithId: str | None = None
    rejectionReason: str | None = None
    verifiedBy: str | None = None
    resolution: ResolutionOut | None = None


class CitizenCaseOut(BaseModel):
    id: str
    case_code: str
    title: str
    category: str
    status: str
    workflow_status: str
    directorate_id: str
    directorate_name: str
    location_text: str
    photo_url: str | None = None
    timeline: list[str]
    created_at: datetime
    lat: float | None = None
    lon: float | None = None


class ClassificationUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str | None = Field(default=None, max_length=300)
    category: str | None = Field(default=None, max_length=80)
    sector: str | None = Field(default=None, max_length=80)
    directorateId: DirectorateId | None = None
    priority: PriorityLabel | None = None


class RejectCase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    reason: str = Field(min_length=3, max_length=1000)


class MergeCase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    targetId: str = Field(min_length=3, max_length=40)


class DirectorateStatusUpdate(BaseModel):
    status: DirectorateStatus


class ResolveCase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    workDescription: str = Field(min_length=3, max_length=2000)
    photoBeforeUrl: str = Field(default="", max_length=500)
    photoAfterUrl: str = Field(default="", max_length=500)


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
    photo_url: str | None = None
    workflow_status: str = "PENDING_REVIEW"
    status: str = "Në shqyrtim"
    title: str = ""
    issue: IssueResponse
