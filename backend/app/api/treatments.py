"""Treatment plans API routes."""

import uuid
from datetime import date, timedelta

from fastapi import APIRouter, HTTPException

from ..models import TreatmentPlanCreate
from ..store import load, save

router = APIRouter(prefix="/api/treatments", tags=["treatments"])


@router.get("")
def list_treatments():
    data = load()
    plans = sorted(
        data.get("treatment_plans", []),
        key=lambda p: p.get("next_session") or "9999",
        reverse=False,
    )
    return plans


@router.get("/{plan_id}")
def get_treatment(plan_id: str):
    data = load()
    plan = next((p for p in data.get("treatment_plans", []) if p["id"] == plan_id), None)
    if not plan:
        raise HTTPException(status_code=404, detail="Treatment plan not found")
    return plan


@router.post("", status_code=201)
def create_treatment(data_in: TreatmentPlanCreate):
    data = load()
    clients = data.get("clients", [])
    client = next((c for c in clients if c["id"] == data_in.client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    new_plan = {
        "id": f"tp-{uuid.uuid4().hex[:6]}",
        "client_id": data_in.client_id,
        "client_name": f"{client['first_name']} {client['last_name']}",
        "plan_type": data_in.plan_type,
        "condition": data_in.condition,
        "total_sessions": data_in.total_sessions,
        "completed_sessions": 0,
        "start_date": date.today().isoformat(),
        "next_session": (date.today() + timedelta(days=7)).isoformat(),
        "goals": data_in.goals,
        "notes": data_in.notes,
    }
    data.setdefault("treatment_plans", []).append(new_plan)
    save(data)
    return new_plan
