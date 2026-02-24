"""
In-memory sliding-window rate limiter.

Uses a dict-based store suitable for single-process development.
For production, swap the backing store to Redis.
"""

import time
from collections import defaultdict

from fastapi import HTTPException, status


class RateLimiter:
    """Per-key sliding-window rate limiter."""

    def __init__(self) -> None:
        self._store: dict[str, list[float]] = defaultdict(list)

    def _cleanup(self, key: str, window_seconds: float) -> None:
        cutoff = time.time() - window_seconds
        self._store[key] = [ts for ts in self._store[key] if ts > cutoff]

    def check(self, key: str, max_attempts: int, window_seconds: float) -> None:
        self._cleanup(key, window_seconds)
        if len(self._store[key]) >= max_attempts:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Try again in {int(window_seconds // 60)} minutes.",
            )

    def record(self, key: str) -> None:
        self._store[key].append(time.time())

    def reset(self, key: str) -> None:
        self._store.pop(key, None)


rate_limiter = RateLimiter()
