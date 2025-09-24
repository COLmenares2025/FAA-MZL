import os
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.main import app
from app.db import init_db, engine
from app.models.user import User, UserRole
from app.auth.security import get_password_hash

# Ensure fresh DB for test
os.environ["DATABASE_URL"] = "sqlite:///./app.db"

client = TestClient(app)


def ensure_admin():
    with Session(engine) as s:
        if not s.exec(select(User).where(User.email == "admin@test.com")).first():
            u = User(name="Admin", email="admin@test.com", password_hash=get_password_hash("admin123"), role=UserRole.admin)
            s.add(u)
            s.commit()


def test_login_ok():
    init_db()
    ensure_admin()
    resp = client.post("/auth/login", data={"username": "admin@test.com", "password": "admin123"})
    assert resp.status_code == 200
    token = resp.json().get("access_token")
    assert token


def test_login_ko():
    resp = client.post("/auth/login", data={"username": "admin@test.com", "password": "wrong"})
    assert resp.status_code == 400
