from __future__ import annotations
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    admin = "Admin"
    mechanic = "Mechanic"
    auditor = "Auditor"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    password_hash: str
    role: UserRole = Field(default=UserRole.admin)
    created_at: datetime = Field(default_factory=datetime.utcnow)
