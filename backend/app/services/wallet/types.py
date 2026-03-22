from dataclasses import dataclass, field


@dataclass(frozen=True)
class WalletActionHintData:
    key: str
    label: str
    type: str
    enabled: bool


@dataclass(frozen=True)
class WalletQuickActionData:
    key: str
    label: str
    type: str
    enabled: bool


@dataclass(frozen=True)
class AssetRegistryEntry:
    coingecko_id: str
    icon: str
    fallback_price_usd: float
    fallback_change_24h: float


@dataclass(frozen=True)
class MockWalletAsset:
    symbol: str
    name: str
    chain: str
    balance: float
    available_balance: float
    locked_balance: float
    wallet_type: str
    is_yielding: bool
    action_hints: list[WalletActionHintData] = field(default_factory=list)


@dataclass(frozen=True)
class MockWalletProtocol:
    name: str
    protocol: str
    category: str
    chain: str
    position_summary: str
    position_usd: float
    status: str
    risk_level: str
    apr: float


@dataclass(frozen=True)
class MockWalletOverviewData:
    address: str
    assets: list[MockWalletAsset] = field(default_factory=list)
    protocols: list[MockWalletProtocol] = field(default_factory=list)
    quick_actions: list[WalletQuickActionData] = field(default_factory=list)
    summary_text: str = ""


@dataclass(frozen=True)
class AssetPriceSnapshot:
    price_usd: float
    change_24h: float


@dataclass(frozen=True)
class PricingBundle:
    prices: dict[str, AssetPriceSnapshot]
    pricing_source: str
    last_updated_at: str
