from fastapi import APIRouter

from app.schemas.wallet import WalletOverviewResponse
from app.services.wallet import get_wallet_overview

router = APIRouter(prefix="/wallet")


@router.get("/overview", response_model=WalletOverviewResponse)
def wallet_overview(address: str | None = None) -> WalletOverviewResponse:
    return get_wallet_overview(address=address)
