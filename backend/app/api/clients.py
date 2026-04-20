"""Clients API routes."""

import uuid
from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..models import ClientCreate, ClientUpdate
from ..store import load, save

router = APIRouter(prefix="/api/clients", tags=["clients"])


@router.get("")
def list_clients(
    search: Optional[str] = Query(None),
    condition: Optional[str] = Query(None),
):
    data = load()
    clients = data.get("clients", [])
    appointments = data.get("appointments", [])

    results = [dict(c) for c in clients]

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
            a for a in appointments
            if a["client_id"] == client["id"] and a["status"] == "completed"
        ]
        client_apts.sort(key=lambda a: a["date"], reverse=True)
        client["last_visit"] = client_apts[0]["date"] if client_apts else None
        client["total_appointments"] = len(client_apts)

    return results


@router.get("/{client_id}")
def get_client(client_id: str):
    data = load()
    clients = data.get("clients", [])
    appointments = data.get("appointments", [])
    treatment_plans = data.get("treatment_plans", [])
    insurance_claims = data.get("insurance_claims", [])

    client = next((c for c in clients if c["id"] == client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Appointment history
    apts = [a for a in appointments if a["client_id"] == client_id]
    apts.sort(key=lambda a: (a["date"], a["time"]), reverse=True)

    # Treatment plans
    plans = [p for p in treatment_plans if p["client_id"] == client_id]

    # Insurance claims
    claims = [c for c in insurance_claims if c["client_id"] == client_id]

    return {
        **client,
        "appointments": apts,
        "treatment_plans": plans,
        "insurance_claims": claims,
    }


@router.post("", status_code=201)
def create_client(data_in: ClientCreate):
    new_client = {
        "id": f"cli-{uuid.uuid4().hex[:6]}",
        "first_name": data_in.first_name,
        "last_name": data_in.last_name,
        "email": data_in.email,
        "phone": data_in.phone,
        "date_of_birth": data_in.date_of_birth.isoformat() if data_in.date_of_birth else None,
        "intake_date": date.today().isoformat(),
        "conditions": data_in.conditions,
        "insurance_provider": data_in.insurance_provider,
        "insurance_id": data_in.insurance_id,
        "notes": data_in.notes,
    }
    data = load()
    data.setdefault("clients", []).append(new_client)
    save(data)
    return new_client


@router.patch("/{client_id}")
def update_client(client_id: str, data_in: ClientUpdate):
    data = load()
    clients = data.get("clients", [])
    client = next((c for c in clients if c["id"] == client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    updates = data_in.model_dump(exclude_unset=True)
    for key, value in updates.items():
        client[key] = value

    save(data)
    return client
