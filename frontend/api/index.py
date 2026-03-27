"""Vercel Serverless Function entry point for WellnessFlow API."""

import os
import sys

# Add the api/ directory to sys.path so `from app.xxx import ...` works
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app  # noqa: E402

handler = app
