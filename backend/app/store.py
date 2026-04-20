"""Persistence layer for WellnessFlow.

Hybrid: Postgres JSONB blob when DATABASE_URL is set (Render), JSON file fallback
for local dev. Render free tier has ephemeral disk — JSON would be wiped on every
cold start, so production must use Postgres.

Exposes load() / save() — route handlers read the whole dict, mutate, and write
it back. Keeps API contracts identical to the previous module-global lists.
"""

from __future__ import annotations

import json
from pathlib import Path

from .database import KVStore, SessionLocal, is_db_enabled

STORE_PATH = Path.home() / ".wellnessflow" / "store.json"

_EMPTY: dict = {
    "clients": [],
    "appointments": [],
    "treatment_plans": [],
    "insurance_claims": [],
    "compliance_items": [],
    "service_types": [],
    "revenue_by_month": [],
}

_KV_KEY = "main"


def _ensure_dir() -> None:
    STORE_PATH.parent.mkdir(parents=True, exist_ok=True)


def load() -> dict:
    if is_db_enabled():
        with SessionLocal() as s:
            row = s.get(KVStore, _KV_KEY)
            if row and row.value:
                return {**_EMPTY, **row.value}
            return {**_EMPTY}
    _ensure_dir()
    if STORE_PATH.exists():
        return {**_EMPTY, **json.loads(STORE_PATH.read_text())}
    return {**_EMPTY}


def save(data: dict) -> None:
    if is_db_enabled():
        with SessionLocal() as s:
            row = s.get(KVStore, _KV_KEY)
            if row:
                row.value = data
            else:
                s.add(KVStore(key=_KV_KEY, value=data))
            s.commit()
        return
    _ensure_dir()
    STORE_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False))


def seed_if_empty() -> None:
    """Populate the store with demo seed data on first run.

    Checks for an existing, non-empty store; if present, leaves it alone so
    user-created records persist. Otherwise loads the demo constants.
    """
    data = load()
    has_any = any(data.get(k) for k in _EMPTY if k != "revenue_by_month")
    if has_any:
        return

    from .demo_data import (
        APPOINTMENTS,
        CLIENTS,
        COMPLIANCE_ITEMS,
        INSURANCE_CLAIMS,
        REVENUE_BY_MONTH,
        SERVICE_TYPES,
        TREATMENT_PLANS,
    )

    save({
        "clients": list(CLIENTS),
        "appointments": list(APPOINTMENTS),
        "treatment_plans": list(TREATMENT_PLANS),
        "insurance_claims": list(INSURANCE_CLAIMS),
        "compliance_items": list(COMPLIANCE_ITEMS),
        "service_types": list(SERVICE_TYPES),
        "revenue_by_month": list(REVENUE_BY_MONTH),
    })
