from __future__ import annotations
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class AircraftStatus(str, Enum):
    active = "ACTIVE"
    archived = "ARCHIVED"


class Aircraft(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    model: str
    serial: str = Field(index=True, unique=True)
    tail_number: str = Field(index=True, unique=True)
    status: AircraftStatus = Field(default=AircraftStatus.active)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TimesCycles(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    aircraft_id: int = Field(foreign_key="aircraft.id", unique=True)
    aircraft_hours: float
    landings: int
    apu_hours: Optional[float] = 0
    apu_cycles: Optional[int] = 0
    eng1_hours: Optional[float] = 0
    eng1_cycles: Optional[int] = 0
    eng2_hours: Optional[float] = 0
    eng2_cycles: Optional[int] = 0
    as_of_date: Optional[str] = None  # mm/dd/yyyy
