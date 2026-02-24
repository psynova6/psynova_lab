"""
Authentication & Onboarding module for Psynova.

Exports the combined FastAPI router for inclusion in the main application.
"""

from fastapi import APIRouter

from app.authentication_onboarding.api.auth import router as auth_router
from app.authentication_onboarding.api.verification import router as verification_router
from app.authentication_onboarding.api.password import router as password_router
from app.authentication_onboarding.api.session import router as session_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(verification_router)
router.include_router(password_router)
router.include_router(session_router)
