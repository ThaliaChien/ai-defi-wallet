from app.schemas.wallet import WalletOverviewResponse
from app.services.wallet.assembler import build_wallet_overview_response
from app.services.wallet.mock_provider import get_mock_wallet_overview_data


def get_wallet_overview(address: str | None = None) -> WalletOverviewResponse:
    overview_data = get_mock_wallet_overview_data(address=address)
    return build_wallet_overview_response(overview_data)
