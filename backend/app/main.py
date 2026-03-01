"""
Psynova Backend — Unified FastAPI application entry point.

All backend components register their routers here so the entire
backend runs as a single `uvicorn app.main:app` process.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import close_db, connect_db

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: connect to MongoDB.  Shutdown: close the connection."""
    await connect_db()
    log.info("Connected to MongoDB and initialised Beanie ODM.")
    yield
    await close_db()
    log.info("MongoDB connection closed.")


app = FastAPI(
    title="Psynova Backend API",
    description=(
        "Unified backend for Psynova — a privacy-first student mental health platform.\n\n"
        "Components:\n"
        "- **Authentication & Onboarding** — signup, login, verification, sessions\n"
        "- *(more components will be added here)*"
    ),
    version="0.1.0",
    lifespan=lifespan,
)

# Removed custom validation error handler to fix serialization issues. Default handler will be used.


# ── CORS (adjust origins for production) ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Register component routers ──

# 1. Authentication & Onboarding
from app.authentication_onboarding import router as auth_onboarding_router  # noqa: E402

app.include_router(auth_onboarding_router)

# 2. User & Institution Management
from app.user_institution_management import router as management_router
app.include_router(management_router)

# 3. Syna AI Chatbot
from app.syna_ai.router import router as syna_router
app.include_router(syna_router)

# 4. (Future components go here)


@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "psynova-backend"}
