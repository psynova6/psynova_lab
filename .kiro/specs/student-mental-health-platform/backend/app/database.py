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
    # Added timeouts to handle DNS resolution/connection delays gracefully
    client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000
    )
    db = client[settings.MONGODB_DB_NAME]

    # Import all Beanie Document models — role-based collections
    from app.authentication_onboarding.models.student import Student
    from app.authentication_onboarding.models.therapist import Therapist
    from app.authentication_onboarding.models.institution_admin import InstitutionAdmin
    from app.authentication_onboarding.models.auth_session import AuthSession
    from app.authentication_onboarding.models.verification import (
        VerificationToken,
        PasswordResetToken,
    )
    from app.user_institution_management.models import Institution, InstitutionUser

    try:
        await init_beanie(
            database=db,
            document_models=[
                Student,
                Therapist,
                InstitutionAdmin,
                AuthSession,
                VerificationToken,
                PasswordResetToken,
                Institution,
                InstitutionUser
            ],
        )
    except Exception as e:
        import traceback
        from pymongo.errors import ConfigurationError
        if isinstance(e, ConfigurationError):
            print("\n" + "="*50)
            print("ERROR: MongoDB Configuration/DNS Issue detected.")
            print("If you are on a network with DNS restrictions, SRV resolution might fail.")
            print("Try switching to a standard connection string (mongodb://) in .env")
            print("="*50 + "\n")
        raise e



async def close_db() -> None:
    """Close the Motor client."""
    global client
    if client:
        client.close()
