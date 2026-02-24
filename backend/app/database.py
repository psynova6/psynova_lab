"""
MongoDB connection via Motor (async driver) + Beanie ODM.
"""

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

import certifi

client: AsyncIOMotorClient = None  # type: ignore[assignment]


async def connect_db() -> None:
    """Initialise Motor client and Beanie ODM with all document models."""
    global client
    # Use certifi for SSL CA certificates to resolve Windows handshake issues
    client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        tlsCAFile=certifi.where()
    )
    db = client[settings.MONGODB_DB_NAME]

    # Import all Beanie Document models so they are registered
    from app.authentication_onboarding.models.user import User
    from app.authentication_onboarding.models.auth_session import AuthSession
    from app.authentication_onboarding.models.verification import (
        VerificationToken,
        PasswordResetToken,
    )
    from app.user_institution_management.models import Institution, InstitutionUser

    await init_beanie(
        database=db,
        document_models=[
            User, 
            AuthSession, 
            VerificationToken, 
            PasswordResetToken,
            Institution,
            InstitutionUser
        ],
    )


async def close_db() -> None:
    """Close the Motor client."""
    global client
    if client:
        client.close()
