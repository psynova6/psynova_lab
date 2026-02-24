"""
Email service using Resend SDK.
"""

import logging

try:
    import resend
    RESEND_AVAILABLE = True
except ImportError:
    resend = None
    RESEND_AVAILABLE = False

from app.config import settings

log = logging.getLogger(__name__)

# Initialize Resend
if RESEND_AVAILABLE and settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY


async def send_verification_email(email: str, otp: str) -> None:
    """Send a 6-digit OTP to the user's email for verification using Resend."""
    if not RESEND_AVAILABLE or not settings.RESEND_API_KEY:
        log.warning("📧 [STUB] Resend not available or API key not set. OTP for %s: %s", email, otp)
        return

    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": email,
            "subject": "Verify your Psynova Account",
            "html": f"""
                <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color: #0d3b31;">Welcome to Psynova!</h2>
                    <p>Your verification code is:</p>
                    <div style="background-color: #f4fdfa; padding: 20px; text-align: center; border-radius: 10px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #16a34a;">{otp}</span>
                    </div>
                    <p>This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
            """
        })
        log.info("📧 Verification email sent to %s via Resend", email)
    except Exception as e:
        log.error("Failed to send verification email to %s: %s", email, str(e))
        # Fallback to log in dev if needed, or re-raise
        log.warning("📧 [FALLBACK] OTP for %s: %s", email, otp)


async def send_password_reset_email(email: str, token: str) -> None:
    """Send a password-reset link to the user's email."""
    if not settings.RESEND_API_KEY:
        log.warning("📧 [STUB] RESEND_API_KEY not set. Reset token for %s: %s", email, token)
        return

    try:
        # In a real app, this would be a link to the frontend: https://psynova.com/reset?token={token}
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": email,
            "subject": "Reset your Psynova Password",
            "html": f"""
                <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color: #0d3b31;">Password Reset Request</h2>
                    <p>We received a request to reset your password. Use the token below or click the link to proceed:</p>
                    <div style="background-color: #f4fdfa; padding: 20px; text-align: center; border-radius: 10px;">
                        <span style="font-size: 18px; font-family: monospace; color: #16a34a;">{token}</span>
                    </div>
                    <p style="margin-top: 20px;">This token will expire in 1 hour.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
            """
        })
        log.info("📧 Password reset email sent to %s via Resend", email)
    except Exception as e:
        log.error("Failed to send password reset email to %s: %s", email, str(e))
