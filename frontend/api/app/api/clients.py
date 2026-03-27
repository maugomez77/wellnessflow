"""Clients API routes."""

import uuid
from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..demo_data import APPOINTMENTS, CLIENTS, INSURANCE_CLAIMS, TREATMENT_PLANS
from ..models import ClientCreate, ClientUpdate

router = APIRouter(prefix="/api/clients", tags=["clients"])


@router.get("")
def list_clients(
    search: Optional[str] = Query(None),
    condition: Optional[str] = Query(None),
):
    results = list(CLIENTS)

    if search:
        q = search.lower()
        results = [
            c for c in results
            if q in c["first_name"].lower()
            or q in c["last_name"].lower()
            or q in c["email"].lower()
        ]

    if condition:
        q = condition.lower()
        results = [
            c for c in results
            if any(q in cond.lower() for cond in c.get("conditions", []))
        ]

    # Enrich with last visit
    for client in results:
        client_apts = [
            a for a in APPOINTMENTS
            if a["client_id"] == client["id"] and a["status"] == "completed"
        ]
        client_apts.sort(key=lambda a: a["date"], reverse=True)
        client["last_visit"] = client_apts[0]["date"] if client_apts else None
        client["total_appointments"] = len(client_apts)

    return results


@router.get("/{client_id}")
def get_client(client_id: str):
    client = next((c for c in CLIENTS if c["id"] == client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Appointment history
    appointments = [a for a in APPOINTMENTS if a["client_id"] == client_id]
    appointments.sort(key=lambda a: (a["date"], a["time"]), reverse=True)

    # Treatment plans
    plans = [p for p in TREATMENT_PLANS if p["client_id"] == client_id]

    # Insurance claims
    claims = [c for c in INSURANCE_CLAIMS if c["client_id"] == client_id]

    return {
        **client,
        "appointments": appointments,
        "treatment_plans": plans,
        "insurance_claims": claims,
    }


@router.post("", status_code=201)
def create_client(data: ClientCreate):
    new_client = {
        "id": f"cli-{uuid.uuid4().hex[:6]}",
        "first_name": data.first_name,
        "last_name": data.last_name,
        "email": data.email,
        "phone": data.phone,
        "date_of_birth": data.date_of_birth.isoformat() if data.date_of_birth else None,
        "intake_date": date.today().isoformat(),
        "conditions": data.conditions,
        "insurance_provider": data.insurance_provider,
        "insurance_id": data.insurance_id,
        "notes": data.notes,
    }
    CLIENTS.append(new_client)
    return new_client


@router.patch("/{client_id}")
def update_client(client_id: str, data: ClientUpdate):
    client = next((c for c in CLIENTS if c["id"] == client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    updates = data.model_dump(exclude_unset=True)
    for key, value in updates.items():
        client[key] = value

    return client
