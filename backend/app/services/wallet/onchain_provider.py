from app.services.wallet.types import MockWalletOverviewData


def get_onchain_wallet_overview_data(address: str) -> MockWalletOverviewData:
    raise NotImplementedError(
        "Real on-chain wallet overview data is not implemented yet."
    )
