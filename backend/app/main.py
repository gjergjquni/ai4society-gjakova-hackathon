from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import CORS_ORIGINS
from .db import SessionLocal, init_db
from .routes.cases import router as cases_router
from .routes.health import router as health_router
from .routes.problems import router as problems_router
from .routes.reports import router as reports_router
from .routes.uploads import router as uploads_router
from .services.seed import seed_demo_problems


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        seed_demo_problems(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="PULSI Backend",
    version="1.1.0",
    description="Municipal problem reporting backend for PULSI.",
    lifespan=lifespan,
)

allow_all = CORS_ORIGINS == ["*"] or not CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(reports_router, prefix="/api/v1")
app.include_router(problems_router, prefix="/api/v1")
app.include_router(cases_router, prefix="/api/v1")
app.include_router(uploads_router, prefix="/api/v1")
