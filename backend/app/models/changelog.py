from __future__ import annotations
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class ChangeLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    actor_user_id: int
    entity_type: str
    entity_id: int
    action: str
    before_json: Optional[str] = None
    after_json: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
