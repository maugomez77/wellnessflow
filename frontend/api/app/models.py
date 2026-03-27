"""Pydantic models for WellnessFlow API."""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# --- Enums ---

class AppointmentStatus(str, Enum):
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"


class ClaimStatus(str, Enum):
    submitted = "submitted"
    under_review = "under_review"
    approved = "approved"
    paid = "paid"
    denied = "denied"


class ComplianceStatus(str, Enum):
    current = "current"
    expiring_soon = "expiring_soon"
    expired = "expired"


# --- Core Models ---

class ServiceType(BaseModel):
    id: str
    name: str
    duration_minutes: int
    price: float
    category: str


class Client(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    date_of_birth: Optional[date] = None
    intake_date: date
    conditions: list[str] = []
    insurance_provider: Optional[str] = None
    insurance_id: Optional[str] = None
    notes: Optional[str] = None


class Appointment(BaseModel):
    id: str
    client_id: str
    client_name: str
    service_type: str
    service_category: str
    date: str  # ISO date
    time: str  # HH:MM
    duration_minutes: int
    status: AppointmentStatus
    price: float
    notes: Optional[str] = None
    practitioner: str = "Dr. Sarah Chen"


class TreatmentPlan(BaseModel):
    id: str
    client_id: str
    client_name: str
    plan_type: str
    condition: str
    total_sessions: int
    completed_sessions: int
    start_date: date
    next_session: Optional[date] = None
    notes: Optional[str] = None
    goals: list[str] = []


class InsuranceClaim(BaseModel):
    id: str
    client_id: str
    client_name: str
    appointment_id: str
    service_type: str
    date_of_service: date
    amount: float
    insurance_provider: str
    status: ClaimStatus
    submitted_date: date
    paid_date: Optional[date] = None
    paid_amount: Optional[float] = None
    denial_reason: Optional[str] = None


class ComplianceItem(BaseModel):
    id: str
    name: str
    category: str
    status: ComplianceStatus
    issue_date: date
    expiry_date: date
    notes: Optional[str] = None


class MonthlyRevenue(BaseModel):
    month: str
    revenue: float


class AppointmentsByType(BaseModel):
    type: str
    count: int


class DashboardMetrics(BaseModel):
    monthly_revenue: float
    total_clients: int
    appointments_this_week: int
    insurance_claims_pending: int
    revenue_by_month: list[MonthlyRevenue]
    appointments_by_type: list[AppointmentsByType]
    client_retention_rate: float
    upcoming_appointments: list[Appointment]


# --- Request Models ---

class ClientCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    date_of_birth: Optional[date] = None
    conditions: list[str] = []
    insurance_provider: Optional[str] = None
    insurance_id: Optional[str] = None
    notes: Optional[str] = None


class ClientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    conditions: Optional[list[str]] = None
    insurance_provider: Optional[str] = None
    insurance_id: Optional[str] = None
    notes: Optional[str] = None


class AppointmentCreate(BaseModel):
    client_id: str
    service_type: str
    date: str
    time: str
    notes: Optional[str] = None


class AppointmentUpdate(BaseModel):
    date: Optional[str] = None
    time: Optional[str] = None
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None


class ClaimCreate(BaseModel):
    client_id: str
    appointment_id: str


class TreatmentPlanCreate(BaseModel):
    client_id: str
    plan_type: str
    condition: str
    total_sessions: int
    goals: list[str] = []
    notes: Optional[str] = None
