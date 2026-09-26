from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    title: Mapped[str] = mapped_column(String(300))
    department_id: Mapped[str] = mapped_column(String(8), index=True)
    location_text: Mapped[str | None] = mapped_column(String(400), nullable=True)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lon: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="OPEN", index=True)
    first_reported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    last_reported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    report_count: Mapped[int] = mapped_column(Integer, default=1)
    embedding_json: Mapped[str | None] = mapped_column(Text, nullable=True)

    reports: Mapped[list[Report]] = relationship(back_populates="problem")


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    text: Mapped[str] = mapped_column(Text)
    location_text: Mapped[str | None] = mapped_column(String(400), nullable=True)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lon: Mapped[float | None] = mapped_column(Float, nullable=True)
    citizen_ref: Mapped[str | None] = mapped_column(String(80), nullable=True)
    intent: Mapped[str] = mapped_column(String(16))
    department_id: Mapped[str] = mapped_column(String(8), index=True)
    department: Mapped[str] = mapped_column(String(200))
    procedure_id: Mapped[str] = mapped_column(String(32))
    confidence: Mapped[float] = mapped_column(Float)
    problem_id: Mapped[str] = mapped_column(String(32), ForeignKey("problems.id"), index=True)
    kb_version: Mapped[str] = mapped_column(String(16))
    model_version: Mapped[str] = mapped_column(String(16))
    evidence_json: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="ROUTED")

    problem: Mapped[Problem] = relationship(back_populates="reports")


class Feedback(Base):
    __tablename__ = "feedback"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    report_id: Mapped[str] = mapped_column(String(32), index=True)
    predicted_department_id: Mapped[str] = mapped_column(String(8))
    correct_department_id: Mapped[str] = mapped_column(String(8))
    predicted_intent: Mapped[str | None] = mapped_column(String(16), nullable=True)
    correct_intent: Mapped[str | None] = mapped_column(String(16), nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
