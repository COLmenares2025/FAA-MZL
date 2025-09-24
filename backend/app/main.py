from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .db import init_db
from .api import auth as auth_router
from .api import aircraft as aircraft_router
from .api import mtrs as mtrs_router
from .api import reports as reports_router


def create_app() -> FastAPI:
    app = FastAPI(title="FAA MTR Tracker API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router.router)
    app.include_router(aircraft_router.router)
    app.include_router(mtrs_router.router)
    app.include_router(reports_router.router)

    @app.on_event("startup")
    def on_startup():
        init_db()
        # Optionally, create initial admin if env vars present
        from .db import Session, engine
        from sqlmodel import select
        from .models.user import User, UserRole
        from .auth.security import get_password_hash
        import os

        email = os.getenv("INITIAL_ADMIN_EMAIL")
        password = os.getenv("INITIAL_ADMIN_PASSWORD")
        if email and password:
            with Session(engine) as session:
                exists = session.exec(select(User).where(User.email == email)).first()
                if not exists:
                    u = User(name="Admin", email=email, password_hash=get_password_hash(password), role=UserRole.admin)
                    session.add(u)
                    session.commit()

    return app


app = create_app()
