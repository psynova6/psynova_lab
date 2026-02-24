# Psynova Backend

Unified backend for **Psynova** — a privacy-first student mental health platform.

## Quick Start

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows  (source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
copy .env.example .env         # then edit .env with your MongoDB URI
uvicorn app.main:app --reload --port 8000
```

> **Prerequisite:** MongoDB must be running on `localhost:27017` (or update `MONGODB_URL` in `.env`).

Open **http://localhost:8000/docs** for interactive Swagger UI.

---

## Architecture

```
backend/
├── app/
│   ├── main.py                        ← Unified entry point (all components)
│   ├── config.py                      ← Shared settings
│   ├── database.py                    ← Motor + Beanie MongoDB connection
│   │
│   ├── authentication_onboarding/     ← Auth & Onboarding component
│   │   ├── models/                    (Beanie Document models)
│   │   ├── schemas/                   (Pydantic request/response DTOs)
│   │   ├── core/                      (Security, OTP, RBAC, rate limiter)
│   │   ├── services/                  (Business logic)
│   │   └── api/                       (FastAPI route handlers)
│   │
│   └── (future_component)/            ← Add more components here
│
├── requirements.txt
└── .env.example
```

### Adding a New Component

1. Create `app/your_component/__init__.py` that exports a `router`
2. In `app/main.py`, add:
   ```python
   from app.your_component import router as your_router
   app.include_router(your_router)
   ```
3. Register any new Beanie Document models in `app/database.py`

---

## API Endpoints — Authentication & Onboarding

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Register (student / counselor / admin) |
| POST | `/api/auth/login` | Authenticate → JWT tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Revoke current session |
| POST | `/api/auth/verify-email` | Submit 6-digit OTP |
| POST | `/api/auth/resend-verification` | Resend OTP (rate-limited) |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset with token |
| POST | `/api/auth/change-password` | Change password (auth'd) |
| GET | `/api/auth/sessions` | List active sessions |
| DELETE | `/api/auth/sessions/{id}` | Revoke single session |
| DELETE | `/api/auth/sessions` | Revoke all sessions |
