from __future__ import annotations
from sqlmodel import SQLModel, Field
from typing import Optional


class MTR(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    aircraft_id: int = Field(foreign_key="aircraft.id")
    transaction_for: str
    aircraft_serial: str
    aircraft_reg: Optional[str] = None
    work_completed_date: str  # mm/dd/yyyy
    work_completed_city: str  # IATA (3) or ICAO (4)


class MTRItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mtr_id: int = Field(foreign_key="mtr.id")
    item_code: Optional[str] = None
    description: str
    quantity: int = 1


class RepairFacility(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mtr_id: int = Field(foreign_key="mtr.id", unique=True)
    facility: str
    facility_certificate: str
    work_order_number: str
    performed_by: str
    certificate_number: str
    date: str  # mm/dd/yyyy


class Inspection(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mtr_id: int = Field(foreign_key="mtr.id", unique=True)
    statement_default: Optional[str] = "The aircraft identified above is presently approved for return to service."
    additional_statement: Optional[str] = None
    inspected_by: str
    certificate_number: str
    date: str  # mm/dd/yyyy
