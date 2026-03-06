import pytest
from httpx import AsyncClient
from app.authentication_onboarding.models.user import Role
from app.authentication_onboarding.models.student import Student
from app.authentication_onboarding.core.security import hash_password

@pytest.mark.asyncio
async def test_login_invalid_role(db_session, app_client: AsyncClient):
    """Verify that a user cannot login with a role different from their registered role."""
    # 1. Setup: Create a student user manually in the DB
    password = "SecurePassword123!"
    student = Student(
        email="student@example.test",
        hashed_password=hash_password(password),
        consent_given_at="2024-01-01T00:00:00Z",
        consent_version="1.0",
        is_verified=True,
    )
    await student.insert()

    # 2. Action & Assert: Attempt to login as an institution (admin)
    login_data = {"email": "student@example.test", "password": password, "role": "admin"}
    response = await app_client.post("/api/auth/login", json=login_data)

    assert response.status_code == 403
    assert "Invalid role" in response.json().get("detail", "")

@pytest.mark.asyncio
async def test_login_valid_role(db_session, app_client: AsyncClient):
    """Verify that a user can login successfully with their correct role."""
    # 1. Setup: Create a student user
    password = "SecurePassword123!"
    student = Student(
        email="student_valid@example.test",
        hashed_password=hash_password(password),
        consent_given_at="2024-01-01T00:00:00Z",
        consent_version="1.0",
        is_verified=True,
    )
    await student.insert()

    # 2. Action & Assert: Attempt to login with correct role
    login_data = {"email": "student_valid@example.test", "password": password, "role": "student"}
    response = await app_client.post("/api/auth/login", json=login_data)

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
