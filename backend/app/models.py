from datetime import datetime, timezone
from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


def utcnow():
    return datetime.now(timezone.utc)


class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    case_code: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(80), index=True)
    category_id: Mapped[str] = mapped_column(String(20), index=True)
    department_id: Mapped[str] = mapped_column(String(20), index=True)
    department_name: Mapped[str] = mapped_column(String(200))
    place_id: Mapped[str | None] = mapped_column(String(20), nullable=True)
    location_text: Mapped[str] = mapped_column(String(200), index=True)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lon: Mapped[float | None] = mapped_column(Float, nullable=True)
    title: Mapped[str] = mapped_column(String(300))
    status: Mapped[str] = mapped_column(String(30), default="Monitorim", index=True)
    severity: Mapped[str] = mapped_column(String(20), default="Mesatare")
    priority: Mapped[int] = mapped_column(Integer, default=64)
    trend: Mapped[int] = mapped_column(Integer, default=4)
    impact: Mapped[str] = mapped_column(String(200), default="1 sinjal i ri")
    recommendation: Mapped[str] = mapped_column(Text, default="")
    reasons: Mapped[list] = mapped_column(JSON, default=list)
    color: Mapped[str] = mapped_column(String(20), default="#65e4ff")
    first_reported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    last_reported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    report_count: Mapped[int] = mapped_column(Integer, default=0)

    reports: Mapped[list["Report"]] = relationship(
        back_populates="problem",
        cascade="all, delete-orphan",
    )


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    text: Mapped[str] = mapped_column(Text)
    custom_text: Mapped[str] = mapped_column(Text, default="")
    location_text: Mapped[str] = mapped_column(String(200))
    place_id: Mapped[str | None] = mapped_column(String(20), nullable=True)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lon: Mapped[float | None] = mapped_column(Float, nullable=True)
    has_photo: Mapped[bool] = mapped_column(Boolean, default=False)

    category: Mapped[str] = mapped_column(String(80), index=True)
    category_id: Mapped[str] = mapped_column(String(20), index=True)
    department_id: Mapped[str] = mapped_column(String(20), index=True)
    department_name: Mapped[str] = mapped_column(String(200))

    problem_id: Mapped[str] = mapped_column(
        ForeignKey("problems.id"),
        index=True,
    )

    duplicate_decision: Mapped[str] = mapped_column(String(50))
    location_match: Mapped[bool] = mapped_column(default=False)
    duplicate_score: Mapped[float] = mapped_column(Float, default=0.0)

    # Reserved integration fields for the AI team.
    ai_intent: Mapped[str | None] = mapped_column(String(30), nullable=True)
    ai_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    ai_procedure_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    ai_evidence: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_model_version: Mapped[str | None] = mapped_column(String(100), nullable=True)

    problem: Mapped[Problem] = relationship(back_populates="reports")
