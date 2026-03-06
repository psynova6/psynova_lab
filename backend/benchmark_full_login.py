import asyncio
import time
import os
import logging
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Mock a few things to avoid full app load if possible
import sys
# Add parent dir to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.authentication_onboarding.services import auth_service
from app.authentication_onboarding.models.student import Student
from app.authentication_onboarding.models.therapist import Therapist
from app.authentication_onboarding.models.institution_admin import InstitutionAdmin
from app.authentication_onboarding.models.verification import VerificationToken, PasswordResetToken
from app.authentication_onboarding.models.auth_session import AuthSession
from app.user_institution_management.models import Institution, InstitutionUser
from app.games.models import UserGameProgress
from app.config import settings

logging.basicConfig(level=logging.INFO)

async def test_full_login_speed():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    await init_beanie(
        database=db,
        document_models=[
            Student, Therapist, InstitutionAdmin, 
            AuthSession, VerificationToken, PasswordResetToken,
            Institution, InstitutionUser, UserGameProgress
        ]
    )
    
    email = "test@example.com"
    password = "StrongPassword123!"
    role = "student"
    
    # Measure login
    print("\n--- Starting Full Login Measurement ---")
    start = time.time()
    try:
        # Note: This will likely fail if user doesn't exist, but we can measure UP TO failure or just check timing logs inside
        await auth_service.login(email=email, password=password, role=role)
    except Exception as e:
        print(f"Login failed as expected/unexpected: {e}")
    total = time.time() - start
    print(f"Total login attempt took: {total:.4f}s")

if __name__ == "__main__":
    asyncio.run(test_full_login_speed())
