from app.schemas.wallet import AssetItem, ProtocolOverviewItem, WalletOverviewResponse

DEMO_ADDRESS = "0x4F3cA5b2C9E7D1a4eB8f2d6A1c3E9b7D5f1A2C4E"
EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000"


def get_wallet_overview(address: str | None = None) -> WalletOverviewResponse:
    resolved_address = address or DEMO_ADDRESS

    if resolved_address.lower() == EMPTY_ADDRESS.lower():
        return WalletOverviewResponse(
            address=resolved_address,
            total_usd_value=0,
            assets=[],
            protocols=[],
            ai_summary=(
                "This wallet is currently inactive in the demo dataset. "
                "Connect a different address to preview portfolio and protocol insights."
            ),
        )

    assets = [
        AssetItem(
            symbol="ETH",
            name="Ethereum",
            balance=1.84,
            usd_value=6423.18,
            chain="Ethereum",
        ),
        AssetItem(
            symbol="USDC",
            name="USD Coin",
            balance=5200.00,
            usd_value=5200.00,
            chain="Base",
        ),
        AssetItem(
            symbol="ARB",
            name="Arbitrum",
            balance=3400.00,
            usd_value=2890.00,
            chain="Arbitrum",
        ),
    ]
    protocols = [
        ProtocolOverviewItem(
            name="Aave",
            category="Lending",
            position_summary="Supplying USDC on Base with steady lending yield.",
        ),
        ProtocolOverviewItem(
            name="Uniswap",
            category="DEX",
            position_summary="Recent swaps between ETH and stablecoins for portfolio rotation.",
        ),
        ProtocolOverviewItem(
            name="GMX",
            category="Perpetuals",
            position_summary="Small exploratory position on Arbitrum with limited exposure.",
        ),
    ]
    total_usd_value = round(sum(asset.usd_value for asset in assets), 2)

    return WalletOverviewResponse(
        address=resolved_address,
        total_usd_value=total_usd_value,
        assets=assets,
        protocols=protocols,
        ai_summary=(
            "This wallet is tilted toward core assets and stablecoin liquidity. "
            "Most value sits in ETH and USDC, with light DeFi activity across lending, "
            "swaps, and a smaller perpetuals position."
        ),
    )
