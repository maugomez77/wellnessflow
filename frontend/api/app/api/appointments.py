"""Appointments API routes."""

import uuid
from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..demo_data import APPOINTMENTS, CLIENTS, SERVICE_TYPES
from ..models import AppointmentCreate, AppointmentUpdate

router = APIRouter(prefix="/api/appointments", tags=["appointments"])


def _find_service(name: str):
    return next((s for s in SERVICE_TYPES if s["name"] == name), None)


@router.get("/calendar")
def get_calendar(
    start_date: Optional[str] = Query(None),
):
    """Return appointments grouped by day for a week view."""
    if start_date:
        start = date.fromisoformat(start_date)
    else:
        today = date.today()
        start = today - timedelta(days=today.weekday())  # Monday

    end = start + timedelta(days=6)

    week_apts = [
        a for a in APPOINTMENTS
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
    results = list(APPOINTMENTS)

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
    apt = next((a for a in APPOINTMENTS if a["id"] == appointment_id), None)
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return apt


@router.post("", status_code=201)
def create_appointment(data: AppointmentCreate):
    client = next((c for c in CLIENTS if c["id"] == data.client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    service = _find_service(data.service_type)
    if not service:
        raise HTTPException(status_code=400, detail="Invalid service type")

    new_apt = {
        "id": f"apt-{uuid.uuid4().hex[:6]}",
        "client_id": data.client_id,
        "client_name": f"{client['first_name']} {client['last_name']}",
        "service_type": service["name"],
        "service_category": service["category"],
        "date": data.date,
        "time": data.time,
        "duration_minutes": service["duration_minutes"],
        "status": "scheduled",
        "price": service["price"],
        "notes": data.notes,
        "practitioner": "Dr. Sarah Chen",
    }
    APPOINTMENTS.append(new_apt)
    return new_apt


@router.patch("/{appointment_id}")
def update_appointment(appointment_id: str, data: AppointmentUpdate):
    apt = next((a for a in APPOINTMENTS if a["id"] == appointment_id), None)
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    updates = data.model_dump(exclude_unset=True)
    for key, value in updates.items():
        if value is not None:
            apt[key] = value if not hasattr(value, "value") else value.value

    return apt
