from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select
import csv

from ..db import get_session
from ..models.aircraft import Aircraft, AircraftStatus, TimesCycles
from ..schemas.aircraft import (
    AircraftCreate,
    AircraftRead,
    AircraftUpdate,
    TimesCyclesCreate,
    TimesCyclesRead,
    TimesCyclesUpdate,
)
from ..models.user import UserRole
from ..auth.security import require_role

router = APIRouter(prefix="/aircraft", tags=["aircraft"])


@router.get("/", response_model=List[AircraftRead])
def list_aircraft(session: Session = Depends(get_session), include_archived: bool = False, q: Optional[str] = None, page: int = 1, size: int = 25):
    statement = select(Aircraft)
    if not include_archived:
        statement = statement.where(Aircraft.status == AircraftStatus.active)
    if q:
        ql = f"%{q.lower()}%"
        statement = statement.where((Aircraft.model.ilike(ql)) | (Aircraft.serial.ilike(ql)) | (Aircraft.tail_number.ilike(ql)))
    statement = statement.offset((page - 1) * size).limit(size)
    return session.exec(statement).all()


@router.post("/", response_model=AircraftRead)
def create_aircraft(payload: AircraftCreate, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin, UserRole.mechanic))):
    if session.exec(select(Aircraft).where((Aircraft.serial == payload.serial) | (Aircraft.tail_number == payload.tail_number))).first():
        raise HTTPException(status_code=400, detail="Serial or tail_number already exists")
    aircraft = Aircraft(**payload.model_dump())
    session.add(aircraft)
    session.commit()
    session.refresh(aircraft)
    return aircraft


@router.get("/{aircraft_id}", response_model=AircraftRead)
def get_aircraft(aircraft_id: int, session: Session = Depends(get_session)):
    aircraft = session.get(Aircraft, aircraft_id)
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")
    return aircraft


@router.put("/{aircraft_id}", response_model=AircraftRead)
@router.patch("/{aircraft_id}", response_model=AircraftRead)
def update_aircraft(aircraft_id: int, payload: AircraftUpdate, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin))):
    aircraft = session.get(Aircraft, aircraft_id)
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(aircraft, k, v)
    session.add(aircraft)
    session.commit()
    session.refresh(aircraft)
    return aircraft


@router.delete("/{aircraft_id}")
def delete_aircraft(aircraft_id: int, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin))):
    aircraft = session.get(Aircraft, aircraft_id)
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")
    if aircraft.status != AircraftStatus.archived:
        raise HTTPException(status_code=400, detail="Can delete only when ARCHIVED")
    session.delete(aircraft)
    session.commit()
    return {"ok": True}


@router.post("/{aircraft_id}/archive")
def archive_aircraft(aircraft_id: int, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin, UserRole.mechanic))):
    aircraft = session.get(Aircraft, aircraft_id)
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")
    aircraft.status = AircraftStatus.archived
    session.add(aircraft)
    session.commit()
    return {"ok": True}


@router.post("/{aircraft_id}/unarchive")
def unarchive_aircraft(aircraft_id: int, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin, UserRole.mechanic))):
    aircraft = session.get(Aircraft, aircraft_id)
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")
    aircraft.status = AircraftStatus.active
    session.add(aircraft)
    session.commit()
    return {"ok": True}


@router.get("/{aircraft_id}/times-cycles", response_model=TimesCyclesRead)
def get_times_cycles(aircraft_id: int, session: Session = Depends(get_session)):
    tc = session.exec(select(TimesCycles).where(TimesCycles.aircraft_id == aircraft_id)).first()
    if not tc:
        raise HTTPException(status_code=404, detail="Times & Cycles not found")
    return tc


@router.put("/{aircraft_id}/times-cycles", response_model=TimesCyclesRead)
def put_times_cycles(aircraft_id: int, payload: TimesCyclesUpdate, session: Session = Depends(get_session), user=Depends(require_role(UserRole.admin, UserRole.mechanic))):
    tc = session.exec(select(TimesCycles).where(TimesCycles.aircraft_id == aircraft_id)).first()
    if not tc:
        tc = TimesCycles(aircraft_id=aircraft_id, **payload.model_dump())
        session.add(tc)
    else:
        for k, v in payload.model_dump(exclude_none=True).items():
            setattr(tc, k, v)
        session.add(tc)
    session.commit()
    session.refresh(tc)
    return tc


@router.post("/import")
async def import_items(csv_file: UploadFile = File(...), user=Depends(require_role(UserRole.admin, UserRole.mechanic))):
    # Placeholder: parse CSV and detect duplicates by item_code; return duplicates
    content = (await csv_file.read()).decode("utf-8", errors="ignore")
    reader = csv.DictReader(content.splitlines())
    seen = set()
    duplicates = []
    for row in reader:
        code = row.get("item_code")
        if code in seen:
            duplicates.append(row)
        else:
            seen.add(code)
    return {"duplicates": duplicates}
