from pydantic import BaseModel
from typing import Optional, List


class MTRBase(BaseModel):
    aircraft_id: int
    transaction_for: str
    aircraft_serial: str
    aircraft_reg: Optional[str] = None
    work_completed_date: str
    work_completed_city: str


class MTRCreate(MTRBase):
    pass


class MTRRead(MTRBase):
    id: int

    class Config:
        from_attributes = True


class MTRItemBase(BaseModel):
    item_code: Optional[str] = None
    description: str
    quantity: int = 1


class MTRItemCreate(MTRItemBase):
    mtr_id: int


class MTRItemRead(MTRItemBase):
    id: int
    mtr_id: int

    class Config:
        from_attributes = True


class RepairFacilityBase(BaseModel):
    facility: str
    facility_certificate: str
    work_order_number: str
    performed_by: str
    certificate_number: str
    date: str


class RepairFacilityCreate(RepairFacilityBase):
    mtr_id: int


class RepairFacilityRead(RepairFacilityBase):
    id: int
    mtr_id: int

    class Config:
        from_attributes = True


class InspectionBase(BaseModel):
    statement_default: Optional[str] = "The aircraft identified above is presently approved for return to service."
    additional_statement: Optional[str] = None
    inspected_by: str
    certificate_number: str
    date: str


class InspectionCreate(InspectionBase):
    mtr_id: int


class InspectionRead(InspectionBase):
    id: int
    mtr_id: int

    class Config:
        from_attributes = True
