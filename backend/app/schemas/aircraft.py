from pydantic import BaseModel
from typing import Optional


class AircraftBase(BaseModel):
    model: str
    serial: str
    tail_number: str


class AircraftCreate(AircraftBase):
    pass


class AircraftUpdate(BaseModel):
    model: Optional[str] = None
    serial: Optional[str] = None
    tail_number: Optional[str] = None


class AircraftRead(AircraftBase):
    id: int
    status: str

    class Config:
        from_attributes = True


class TimesCyclesBase(BaseModel):
    aircraft_hours: float
    landings: int
    apu_hours: Optional[float] = 0
    apu_cycles: Optional[int] = 0
    eng1_hours: Optional[float] = 0
    eng1_cycles: Optional[int] = 0
    eng2_hours: Optional[float] = 0
    eng2_cycles: Optional[int] = 0
    as_of_date: Optional[str] = None


class TimesCyclesCreate(TimesCyclesBase):
    pass


class TimesCyclesUpdate(TimesCyclesBase):
    pass


class TimesCyclesRead(TimesCyclesBase):
    id: int
    aircraft_id: int

    class Config:
        from_attributes = True
