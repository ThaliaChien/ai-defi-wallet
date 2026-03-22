from fastapi import APIRouter

from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.wallet import router as wallet_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(wallet_router, tags=["wallet"])
