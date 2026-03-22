from app.services.wallet.constants import DEMO_ADDRESS, EMPTY_ADDRESS
from app.services.wallet.types import (
    MockWalletAsset,
    MockWalletOverviewData,
    MockWalletProtocol,
    WalletActionHintData,
    WalletQuickActionData,
)


def resolve_wallet_address(address: str | None) -> str:
    return address or DEMO_ADDRESS


def _default_quick_actions() -> list[WalletQuickActionData]:
    return [
        WalletQuickActionData(key="deposit", label="Deposit", type="transfer", enabled=True),
        WalletQuickActionData(key="withdraw", label="Withdraw", type="transfer", enabled=True),
        WalletQuickActionData(key="swap", label="Swap", type="trade", enabled=True),
        WalletQuickActionData(key="earn", label="Earn", type="yield", enabled=True),
    ]


def get_mock_wallet_overview_data(address: str | None = None) -> MockWalletOverviewData:
    resolved_address = resolve_wallet_address(address)

    if resolved_address.lower() == EMPTY_ADDRESS.lower():
        return MockWalletOverviewData(
            address=resolved_address,
            quick_actions=_default_quick_actions(),
            summary_text=(
                "This wallet is currently inactive in the demo dataset. "
                "Connect a different address to preview portfolio and protocol insights."
            ),
        )

    assets = [
        MockWalletAsset(
            symbol="ETH",
            name="Ethereum",
            chain="Ethereum",
            balance=1.84,
            available_balance=1.24,
            locked_balance=0.60,
            wallet_type="spot",
            is_yielding=False,
            action_hints=[
                WalletActionHintData(key="trade_eth", label="Trade", type="trade", enabled=True),
                WalletActionHintData(key="bridge_eth", label="Bridge", type="bridge", enabled=True),
            ],
        ),
        MockWalletAsset(
            symbol="USDC",
            name="USD Coin",
            chain="Base",
            balance=5200.00,
            available_balance=4200.00,
            locked_balance=1000.00,
            wallet_type="earn",
            is_yielding=True,
            action_hints=[
                WalletActionHintData(key="earn_usdc", label="Earn", type="yield", enabled=True),
                WalletActionHintData(key="send_usdc", label="Send", type="transfer", enabled=True),
            ],
        ),
        MockWalletAsset(
            symbol="ARB",
            name="Arbitrum",
            chain="Arbitrum",
            balance=3400.00,
            available_balance=3000.00,
            locked_balance=400.00,
            wallet_type="defi",
            is_yielding=True,
            action_hints=[
                WalletActionHintData(key="stake_arb", label="Stake", type="yield", enabled=True),
                WalletActionHintData(key="swap_arb", label="Swap", type="trade", enabled=True),
            ],
        ),
    ]
    protocols = [
        MockWalletProtocol(
            name="Aave",
            protocol="Aave",
            category="Lending",
            chain="Base",
            position_summary="Supplying USDC on Base with steady lending yield.",
            position_usd=1000.00,
            status="active",
            risk_level="medium",
            apr=5.1,
        ),
        MockWalletProtocol(
            name="Uniswap",
            protocol="Uniswap",
            category="DEX",
            chain="Ethereum",
            position_summary="Recent swaps between ETH and stablecoins for portfolio rotation.",
            position_usd=620.00,
            status="active",
            risk_level="low",
            apr=0.0,
        ),
        MockWalletProtocol(
            name="GMX",
            protocol="GMX",
            category="Perpetuals",
            chain="Arbitrum",
            position_summary="Small exploratory position on Arbitrum with limited exposure.",
            position_usd=420.00,
            status="monitoring",
            risk_level="high",
            apr=12.4,
        ),
    ]

    return MockWalletOverviewData(
        address=resolved_address,
        assets=assets,
        protocols=protocols,
        quick_actions=_default_quick_actions(),
        summary_text=(
            "This wallet is tilted toward core assets and stablecoin liquidity. "
            "Most value sits in ETH and USDC, with light DeFi activity across lending, "
            "swaps, and a smaller perpetuals position."
        ),
    )
