"""Dashboard API routes."""

from datetime import date, timedelta

from fastapi import APIRouter

from ..store import load

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("")
def get_dashboard():
    data = load()
    appointments = data.get("appointments", [])
    clients = data.get("clients", [])
    insurance_claims = data.get("insurance_claims", [])
    revenue_by_month = data.get("revenue_by_month", [])

    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)

    # Monthly revenue (current month)
    current_month = today.strftime("%Y-%m")
    monthly_revenue = 0.0
    for r in revenue_by_month:
        if r["month"] == current_month:
            monthly_revenue = r["revenue"]
            break

    # Total clients
    total_clients = len(clients)

    # Appointments this week
    appointments_this_week = 0
    for apt in appointments:
        apt_date = date.fromisoformat(apt["date"])
        if week_start <= apt_date <= week_end and apt["status"] in ("scheduled", "completed"):
            appointments_this_week += 1

    # Pending insurance claims
    pending_statuses = {"submitted", "under_review"}
    insurance_claims_pending = sum(
        1 for c in insurance_claims if c["status"] in pending_statuses
    )

    # Appointments by type
    type_counts: dict[str, int] = {}
    for apt in appointments:
        if apt["status"] == "completed":
            cat = apt["service_category"]
            type_counts[cat] = type_counts.get(cat, 0) + 1
    appointments_by_type = [
        {"type": t, "count": c} for t, c in sorted(type_counts.items(), key=lambda x: -x[1])
    ]

    # Client retention rate (clients with 2+ completed appointments)
    client_apt_counts: dict[str, int] = {}
    for apt in appointments:
        if apt["status"] == "completed":
            cid = apt["client_id"]
            client_apt_counts[cid] = client_apt_counts.get(cid, 0) + 1
    returning = sum(1 for c in client_apt_counts.values() if c >= 2)
    retention_rate = (returning / max(len(client_apt_counts), 1)) * 100

    # Upcoming appointments (next 5 scheduled)
    upcoming = [
        a for a in appointments
        if a["status"] == "scheduled" and date.fromisoformat(a["date"]) >= today
    ]
    upcoming.sort(key=lambda a: (a["date"], a["time"]))
    upcoming_5 = upcoming[:5]

    return {
        "monthly_revenue": monthly_revenue,
        "total_clients": total_clients,
        "appointments_this_week": appointments_this_week,
        "insurance_claims_pending": insurance_claims_pending,
        "revenue_by_month": revenue_by_month,
        "appointments_by_type": appointments_by_type,
        "client_retention_rate": round(retention_rate, 1),
        "upcoming_appointments": upcoming_5,
    }
