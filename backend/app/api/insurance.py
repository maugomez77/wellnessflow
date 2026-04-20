"""Insurance API routes."""

import uuid
from datetime import date

from fastapi import APIRouter, HTTPException

from ..models import ClaimCreate
from ..store import load, save

router = APIRouter(prefix="/api/insurance", tags=["insurance"])


@router.get("/claims")
def list_claims(status: str | None = None):
    data = load()
    claims = data.get("insurance_claims", [])

    results = list(claims)
    if status:
        results = [c for c in results if c["status"] == status]
    results.sort(key=lambda c: c["submitted_date"], reverse=True)

    # Summary stats
    total_submitted = sum(c["amount"] for c in claims)
    total_paid = sum(c.get("paid_amount", 0) or 0 for c in claims)
    pending_count = sum(
        1 for c in claims if c["status"] in ("submitted", "under_review")
    )
    paid_count = sum(1 for c in claims if c["status"] == "paid")
    denied_count = sum(1 for c in claims if c["status"] == "denied")
    approved_count = sum(1 for c in claims if c["status"] == "approved")

    return {
        "claims": results,
        "summary": {
            "total_submitted": total_submitted,
            "total_paid": total_paid,
            "pending_count": pending_count,
            "paid_count": paid_count,
            "denied_count": denied_count,
            "approved_count": approved_count,
            "success_rate": round(
                (paid_count + approved_count)
                / max(len(claims), 1)
                * 100,
                1,
            ),
        },
    }


@router.get("/claims/{claim_id}")
def get_claim(claim_id: str):
    data = load()
    claim = next((c for c in data.get("insurance_claims", []) if c["id"] == claim_id), None)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


@router.post("/claims", status_code=201)
def create_claim(data_in: ClaimCreate):
    data = load()
    clients = data.get("clients", [])
    appointments = data.get("appointments", [])

    client = next((c for c in clients if c["id"] == data_in.client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    apt = next((a for a in appointments if a["id"] == data_in.appointment_id), None)
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if not client.get("insurance_provider"):
        raise HTTPException(status_code=400, detail="Client has no insurance on file")

    new_claim = {
        "id": f"clm-{uuid.uuid4().hex[:6]}",
        "client_id": data_in.client_id,
        "client_name": f"{client['first_name']} {client['last_name']}",
        "appointment_id": data_in.appointment_id,
        "service_type": apt["service_type"],
        "date_of_service": apt["date"],
        "amount": apt["price"],
        "insurance_provider": client["insurance_provider"],
        "status": "submitted",
        "submitted_date": date.today().isoformat(),
    }
    data.setdefault("insurance_claims", []).append(new_claim)
    save(data)
    return new_claim
