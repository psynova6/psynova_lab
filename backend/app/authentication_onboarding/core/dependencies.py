"""
FastAPI dependencies for authentication and role-based access control.
Uses role claim in JWT to look up user from the correct collection:
  - "student"   → students
  - "counselor" → therapists
  - "admin"     → institution_admins
"""

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError

from app.authentication_onboarding.core.security import decode_token
from app.authentication_onboarding.models.user import Role, get_model_for_role

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
):
    """
    Extract and validate the Bearer access token, then return the
    corresponding user document from the role-specific MongoDB collection.

    The JWT payload carries both:
      - 'sub': the user's MongoDB _id (as string)
      - 'role': "student" | "counselor" | "admin"

    The role is used to select the correct Beanie Document class for lookup,
    avoiding cross-collection scanning.
    """
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise credentials_exception
        user_id: str | None = payload.get("sub")
        role: str | None = payload.get("role")
        if user_id is None or role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Resolve the correct Beanie Document class from the role
    try:
        UserModel = get_model_for_role(role)
    except ValueError:
        raise credentials_exception

    user = await UserModel.get(user_id)

    if user is None:
        raise credentials_exception
    if user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is blocked. Contact support.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )
    return user


def role_required(*allowed_roles: Role):
    """
    Dependency factory that restricts access to users with specific roles.

    Usage::

        @router.get("/admin-only", dependencies=[Depends(role_required(Role.ADMIN))])
        async def admin_dashboard(): ...
    """

    async def _check_role(
        current_user: Annotated[object, Depends(get_current_user)],
    ):
        if current_user.role not in [r.value for r in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions.",
            )
        return current_user

    return _check_role
