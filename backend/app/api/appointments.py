"""Appointments API routes."""

import uuid
from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..models import AppointmentCreate, AppointmentUpdate
from ..store import load, save

router = APIRouter(prefix="/api/appointments", tags=["appointments"])


def _find_service(service_types: list, name: str):
    return next((s for s in service_types if s["name"] == name), None)


@router.get("/calendar")
def get_calendar(
    start_date: Optional[str] = Query(None),
):
    """Return appointments grouped by day for a week view."""
    data = load()
    appointments = data.get("appointments", [])

    if start_date:
        start = date.fromisoformat(start_date)
    else:
        today = date.today()
        start = today - timedelta(days=today.weekday())  # Monday

    end = start + timedelta(days=6)

    week_apts = [
        a for a in appointments
        if start.isoformat() <= a["date"] <= end.isoformat()
    ]
    week_apts.sort(key=lambda a: (a["date"], a["time"]))

    # Group by date
    calendar: dict[str, list] = {}
    current = start
    while current <= end:
        day_str = current.isoformat()
        calendar[day_str] = [a for a in week_apts if a["date"] == day_str]
        current += timedelta(days=1)

    return {"start_date": start.isoformat(), "end_date": end.isoformat(), "days": calendar}


@router.get("")
def list_appointments(
    status: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
):
    data = load()
    results = list(data.get("appointments", []))

    if status:
        results = [a for a in results if a["status"] == status]

    if start_date:
        results = [a for a in results if a["date"] >= start_date]

    if end_date:
        results = [a for a in results if a["date"] <= end_date]

    results.sort(key=lambda a: (a["date"], a["time"]), reverse=True)
    return results


@router.get("/{appointment_id}")
def get_appointment(appointment_id: str):
    data = load()
    apt = next((a for a in data.get("appointments", []) if a["id"] == appointment_id), None)
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return apt


@router.post("", status_code=201)
def create_appointment(data_in: AppointmentCreate):
    data = load()
    clients = data.get("clients", [])
    service_types = data.get("service_types", [])

    client = next((c for c in clients if c["id"] == data_in.client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    service = _find_service(service_types, data_in.service_type)
    if not service:
        raise HTTPException(status_code=400, detail="Invalid service type")

    new_apt = {
        "id": f"apt-{uuid.uuid4().hex[:6]}",
        "client_id": data_in.client_id,
        "client_name": f"{client['first_name']} {client['last_name']}",
        "service_type": service["name"],
        "service_category": service["category"],
        "date": data_in.date,
        "time": data_in.time,
        "duration_minutes": service["duration_minutes"],
        "status": "scheduled",
        "price": service["price"],
        "notes": data_in.notes,
        "practitioner": "Dr. Sarah Chen",
    }
    data.setdefault("appointments", []).append(new_apt)
    save(data)
    return new_apt


@router.patch("/{appointment_id}")
def update_appointment(appointment_id: str, data_in: AppointmentUpdate):
    data = load()
    apt = next((a for a in data.get("appointments", []) if a["id"] == appointment_id), None)
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    updates = data_in.model_dump(exclude_unset=True)
    for key, value in updates.items():
        if value is not None:
            apt[key] = value if not hasattr(value, "value") else value.value

    save(data)
    return apt
