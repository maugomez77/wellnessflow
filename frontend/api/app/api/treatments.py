"""Treatment plans API routes."""

import uuid
from datetime import date, timedelta

from fastapi import APIRouter, HTTPException

from ..demo_data import CLIENTS, TREATMENT_PLANS
from ..models import TreatmentPlanCreate

router = APIRouter(prefix="/api/treatments", tags=["treatments"])


@router.get("")
def list_treatments():
    plans = sorted(TREATMENT_PLANS, key=lambda p: p.get("next_session") or "9999", reverse=False)
    return plans


@router.get("/{plan_id}")
def get_treatment(plan_id: str):
    plan = next((p for p in TREATMENT_PLANS if p["id"] == plan_id), None)
    if not plan:
        raise HTTPException(status_code=404, detail="Treatment plan not found")
    return plan


@router.post("", status_code=201)
def create_treatment(data: TreatmentPlanCreate):
    client = next((c for c in CLIENTS if c["id"] == data.client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    new_plan = {
        "id": f"tp-{uuid.uuid4().hex[:6]}",
        "client_id": data.client_id,
        "client_name": f"{client['first_name']} {client['last_name']}",
        "plan_type": data.plan_type,
        "condition": data.condition,
        "total_sessions": data.total_sessions,
        "completed_sessions": 0,
        "start_date": date.today().isoformat(),
        "next_session": (date.today() + timedelta(days=7)).isoformat(),
        "goals": data.goals,
        "notes": data.notes,
    }
    TREATMENT_PLANS.append(new_plan)
    return new_plan
