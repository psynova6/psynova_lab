"""
Session management service (MongoDB / Beanie).
"""

from datetime import datetime, timedelta, timezone

from app.authentication_onboarding.core.security import create_refresh_token, hash_token
from app.authentication_onboarding.models.auth_session import AuthSession
from app.config import settings


async def create_session(
    user_id: str,
    role: str,
    remember_me: bool = False,
    device_info: str | None = None,
    ip_address: str | None = None,
) -> tuple[AuthSession, str]:
    """Create a new auth session and return (session, raw_refresh_token)."""
    days = settings.REMEMBER_ME_EXPIRE_DAYS if remember_me else settings.REFRESH_TOKEN_EXPIRE_DAYS
    expires_at = datetime.now(timezone.utc) + timedelta(days=days)

    # We need a session_id before creating the token, so create the document
    # first, then update with the hash.
    session = AuthSession(
        user_id=user_id,
        refresh_token_hash="",  # placeholder
        device_info=device_info,
        ip_address=ip_address,
        remember_me=remember_me,
        expires_at=expires_at,
    )
    await session.insert()

    raw_refresh = create_refresh_token(
        sub=user_id, role=role, session_id=str(session.id), remember_me=remember_me
    )
    session.refresh_token_hash = hash_token(raw_refresh)
    await session.save()

    return session, raw_refresh


async def list_user_sessions(user_id: str) -> list[AuthSession]:
    """Return all active (non-revoked, non-expired) sessions for a user."""
    now = datetime.now(timezone.utc)
    return await AuthSession.find(
        AuthSession.user_id == user_id,
        AuthSession.revoked_at == None,  # noqa: E711
        AuthSession.expires_at > now,
    ).to_list()


async def revoke_session(session_id: str, user_id: str) -> bool:
    """Revoke a single session. Returns True if successful."""
    from beanie import PydanticObjectId

    session = await AuthSession.get(PydanticObjectId(session_id))
    if not session or session.user_id != user_id or session.revoked_at is not None:
        return False
    session.revoked_at = datetime.now(timezone.utc)
    await session.save()
    return True


async def revoke_all_sessions(user_id: str, exclude_session_id: str | None = None) -> int:
    """Revoke all active sessions for a user, optionally excluding one."""
    now = datetime.now(timezone.utc)
    sessions = await AuthSession.find(
        AuthSession.user_id == user_id,
        AuthSession.revoked_at == None,  # noqa: E711
    ).to_list()

    count = 0
    for s in sessions:
        if exclude_session_id and str(s.id) == exclude_session_id:
            continue
        s.revoked_at = now
        await s.save()
        count += 1
    return count


async def get_session_by_id(session_id: str) -> AuthSession | None:
    """Fetch a session by its ID."""
    from beanie import PydanticObjectId

    try:
        return await AuthSession.get(PydanticObjectId(session_id))
    except Exception:
        return None
