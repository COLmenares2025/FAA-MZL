from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models.mtr import MTR, MTRItem, RepairFacility, Inspection
from ..schemas.mtr import (
    MTRCreate, MTRRead, MTRItemCreate, MTRItemRead, RepairFacilityCreate, RepairFacilityRead, InspectionCreate, InspectionRead
)
from ..auth.security import require_role
from ..models.user import UserRole

router = APIRouter(prefix="/mtrs", tags=["mtrs"])


@router.get("/", response_model=List[MTRRead])
def list_mtrs(session: Session = Depends(get_session), aircraft_id: int | None = None, page: int = 1, size: int = 25):
    stmt = select(MTR)
    if aircraft_id:
        stmt = stmt.where(MTR.aircraft_id == aircraft_id)
    stmt = stmt.offset((page - 1) * size).limit(size)
    return session.exec(stmt).all()


@router.get("/{mtr_id}", response_model=MTRRead)
def get_mtr(mtr_id: int, session: Session = Depends(get_session)):
    mtr = session.get(MTR, mtr_id)
    if not mtr:
        raise HTTPException(status_code=404, detail="MTR not found")
    return mtr


@router.post("/", response_model=MTRRead)
def create_mtr(payload: MTRCreate, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin, UserRole.mechanic))):
    mtr = MTR(**payload.model_dump())
    session.add(mtr)
    session.commit()
    session.refresh(mtr)
    return mtr


@router.post("/{mtr_id}/items", response_model=MTRItemRead)
def add_item(mtr_id: int, payload: MTRItemCreate, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin, UserRole.mechanic))):
    if payload.mtr_id != mtr_id:
        raise HTTPException(status_code=400, detail="mtr_id mismatch")
    item = MTRItem(**payload.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.delete("/{mtr_id}/items/{item_id}")
def delete_item(mtr_id: int, item_id: int, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin, UserRole.mechanic))):
    item = session.get(MTRItem, item_id)
    if not item or item.mtr_id != mtr_id:
        raise HTTPException(status_code=404, detail="Item not found")
    session.delete(item)
    session.commit()
    return {"ok": True}


@router.post("/{mtr_id}/repair-facility", response_model=RepairFacilityRead)
def set_repair_facility(mtr_id: int, payload: RepairFacilityCreate, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin, UserRole.mechanic))):
    if payload.mtr_id != mtr_id:
        raise HTTPException(status_code=400, detail="mtr_id mismatch")
    rf = RepairFacility(**payload.model_dump())
    session.add(rf)
    session.commit()
    session.refresh(rf)
    return rf


@router.post("/{mtr_id}/inspection", response_model=InspectionRead)
def set_inspection(mtr_id: int, payload: InspectionCreate, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin, UserRole.mechanic))):
    if payload.mtr_id != mtr_id:
        raise HTTPException(status_code=400, detail="mtr_id mismatch")
    inspection = Inspection(**payload.model_dump())
    session.add(inspection)
    session.commit()
    session.refresh(inspection)
    return inspection
