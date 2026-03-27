"""Dashboard API routes."""

from datetime import date, timedelta

from fastapi import APIRouter

from ..demo_data import (
    APPOINTMENTS,
    CLIENTS,
    INSURANCE_CLAIMS,
    REVENUE_BY_MONTH,
)

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("")
def get_dashboard():
    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)

    # Monthly revenue (current month)
    current_month = today.strftime("%Y-%m")
    monthly_revenue = 0.0
    for r in REVENUE_BY_MONTH:
        if r["month"] == current_month:
            monthly_revenue = r["revenue"]
            break

    # Total clients
    total_clients = len(CLIENTS)

    # Appointments this week
    appointments_this_week = 0
    for apt in APPOINTMENTS:
        apt_date = date.fromisoformat(apt["date"])
        if week_start <= apt_date <= week_end and apt["status"] in ("scheduled", "completed"):
            appointments_this_week += 1

    # Pending insurance claims
    pending_statuses = {"submitted", "under_review"}
    insurance_claims_pending = sum(
        1 for c in INSURANCE_CLAIMS if c["status"] in pending_statuses
    )

    # Appointments by type
    type_counts: dict[str, int] = {}
    for apt in APPOINTMENTS:
        if apt["status"] == "completed":
            cat = apt["service_category"]
            type_counts[cat] = type_counts.get(cat, 0) + 1
    appointments_by_type = [
        {"type": t, "count": c} for t, c in sorted(type_counts.items(), key=lambda x: -x[1])
    ]

    # Client retention rate (clients with 2+ completed appointments)
    client_apt_counts: dict[str, int] = {}
    for apt in APPOINTMENTS:
        if apt["status"] == "completed":
            cid = apt["client_id"]
            client_apt_counts[cid] = client_apt_counts.get(cid, 0) + 1
    returning = sum(1 for c in client_apt_counts.values() if c >= 2)
    retention_rate = (returning / max(len(client_apt_counts), 1)) * 100

    # Upcoming appointments (next 5 scheduled)
    upcoming = [
        a for a in APPOINTMENTS
        if a["status"] == "scheduled" and date.fromisoformat(a["date"]) >= today
    ]
    upcoming.sort(key=lambda a: (a["date"], a["time"]))
    upcoming_5 = upcoming[:5]

    return {
        "monthly_revenue": monthly_revenue,
        "total_clients": total_clients,
        "appointments_this_week": appointments_this_week,
        "insurance_claims_pending": insurance_claims_pending,
        "revenue_by_month": REVENUE_BY_MONTH,
        "appointments_by_type": appointments_by_type,
        "client_retention_rate": round(retention_rate, 1),
        "upcoming_appointments": upcoming_5,
    }
