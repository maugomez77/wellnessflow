"""WellnessFlow API — Practice management for wellness practitioners."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import appointments, clients, compliance, dashboard, insurance, treatments
from app.demo_data import SERVICE_TYPES

app = FastAPI(
    title="WellnessFlow API",
    description="Practice management platform for independent wellness practitioners",
    version="1.0.0",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://wellnessflow.vercel.app",
        "https://wellnessflow-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(dashboard.router)
app.include_router(clients.router)
app.include_router(appointments.router)
app.include_router(insurance.router)
app.include_router(treatments.router)
app.include_router(compliance.router)


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "wellnessflow-api", "version": "1.0.0"}


@app.get("/api/services")
def list_services():
    return SERVICE_TYPES
