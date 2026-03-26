"""Compliance API routes."""

from fastapi import APIRouter

from ..demo_data import COMPLIANCE_ITEMS

router = APIRouter(prefix="/api/compliance", tags=["compliance"])


@router.get("")
def list_compliance():
    items = sorted(COMPLIANCE_ITEMS, key=lambda c: c["expiry_date"])

    # Summary
    current = sum(1 for c in items if c["status"] == "current")
    expiring = sum(1 for c in items if c["status"] == "expiring_soon")
    expired = sum(1 for c in items if c["status"] == "expired")

    return {
        "items": items,
        "summary": {
            "total": len(items),
            "current": current,
            "expiring_soon": expiring,
            "expired": expired,
        },
    }
