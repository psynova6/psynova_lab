"""
Centralised application settings loaded from environment variables / .env file.
"""

from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Force .env to override system environment variables for local development stability
load_dotenv(override=True)

class Settings(BaseSettings):
    # ── MongoDB ──
    MONGODB_URL: str = "mongodb+srv://psynova6_db_user:GQqQouV5E86m4WC9@psynova.gdin41s.mongodb.net/?appName=Psynova"
    MONGODB_DB_NAME: str = "psynova"

    # ── JWT ──
    SECRET_KEY: str = "change-me-to-a-random-64-char-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    REMEMBER_ME_EXPIRE_DAYS: int = 30

    # ── OTP ──
    OTP_EXPIRE_MINUTES: int = 10
    OTP_MAX_ATTEMPTS: int = 5
    OTP_MAX_RESENDS_PER_HOUR: int = 3

    # ── Rate Limiting ──
    LOGIN_MAX_ATTEMPTS: int = 5
    LOGIN_WINDOW_MINUTES: int = 15
    AUTO_BLOCK_AFTER_FAILURES: int = 10

    # ── Email (Resend) ──
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "onboarding@resend.dev"

    # ── Security & AI ──
    ENCRYPTION_MASTER_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # ── Database Credentials (Optional override) ──
    MONGODB_USER: str = ""
    MONGODB_PASSWORD: str = ""

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore"
    }


settings = Settings()
