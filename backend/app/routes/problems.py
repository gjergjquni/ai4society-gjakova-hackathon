from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Problem
from ..schemas import IssueResponse, ProblemStatusUpdate
from ..services.issues import problem_to_issue, problems_to_issues
from ..taxonomy import ACTIVE_STATUSES

router = APIRouter(prefix="/problems", tags=["problems"])


@router.get("", response_model=list[IssueResponse])
def list_problems(
    status: str | None = None,
    category_id: str | None = None,
    db: Session = Depends(get_db),
):
    stmt = select(Problem)
    if status:
        if status not in ACTIVE_STATUSES:
            raise HTTPException(status_code=422, detail="Invalid status filter")
        stmt = stmt.where(Problem.status == status)
    if category_id:
        stmt = stmt.where(Problem.category_id == category_id)

    problems = list(db.scalars(stmt).all())
    return problems_to_issues(problems)


@router.get("/{problem_id}", response_model=IssueResponse)
def get_problem(problem_id: str, db: Session = Depends(get_db)):
    problem = db.scalar(
        select(Problem).where(
            (Problem.id == problem_id) | (Problem.case_code == problem_id)
        )
    )
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem_to_issue(problem)


@router.patch("/{problem_id}/status", response_model=IssueResponse)
def update_status(
    problem_id: str,
    payload: ProblemStatusUpdate,
    db: Session = Depends(get_db),
):
    problem = db.scalar(
        select(Problem).where(
            (Problem.id == problem_id) | (Problem.case_code == problem_id)
        )
    )
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    problem.status = payload.status
    db.commit()
    db.refresh(problem)
    return problem_to_issue(problem)
