from fastapi import APIRouter, Depends
from ..auth.security import require_role
from ..models.user import UserRole

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/")
def list_reports(user=Depends(require_role(UserRole.admin, UserRole.mechanic, UserRole.auditor))):
    return {
        "reports": [
            {"id": "mtrs_summary", "name": "MTRs Summary"},
            {"id": "aircraft_status", "name": "Aircraft Status"},
        ]
    }
