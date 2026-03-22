from pydantic import BaseModel, Field


class AssetActionHintSchema(BaseModel):
    key: str = Field(..., description="Stable action identifier.")
    label: str = Field(..., description="Display label for the asset action.")
    type: str = Field(..., description="Action type such as trade, earn, or transfer.")
    enabled: bool = Field(..., description="Whether the action is currently enabled.")


class QuickActionSchema(BaseModel):
    key: str = Field(..., description="Stable quick action identifier.")
    label: str = Field(..., description="Display label for the quick action.")
    type: str = Field(..., description="Action category for frontend routing.")
    enabled: bool = Field(..., description="Whether the quick action is available.")


class WalletSectionSchema(BaseModel):
    key: str = Field(..., description="Stable wallet section identifier.")
    label: str = Field(..., description="Display label for the wallet section.")
    wallet_type: str = Field(..., description="Wallet type represented by this section.")
    total_usd_value: float = Field(..., description="USD total for the section.")
    asset_count: int = Field(..., description="Number of assets in the section.")


class WalletAssetSchema(BaseModel):
    symbol: str = Field(..., description="Token symbol displayed in the wallet.")
    name: str = Field(..., description="Human-readable asset name.")
    icon: str = Field(..., description="Icon URL or asset icon path.")
    chain: str = Field(..., description="Blockchain where the asset is held.")
    balance: float = Field(..., description="Token balance held by the wallet.")
    available_balance: float = Field(..., description="Balance available for transfer or trade.")
    locked_balance: float = Field(..., description="Balance currently locked or allocated.")
    price_usd: float = Field(..., description="Current USD price per asset.")
    change_24h: float = Field(..., description="24-hour percentage change for the asset price.")
    usd_value: float = Field(..., description="Estimated USD value for the asset.")
    allocation_pct: float = Field(..., description="Portfolio allocation percentage for the asset.")
    wallet_type: str = Field(..., description="Wallet bucket such as spot, earn, or defi.")
    is_yielding: bool = Field(..., description="Whether the asset is currently generating yield.")
    action_hints: list[AssetActionHintSchema] = Field(
        default_factory=list,
        description="Structured action hints for frontend rendering.",
    )


class WalletProtocolSchema(BaseModel):
    name: str = Field(..., description="Backward-compatible protocol display name.")
    protocol: str = Field(..., description="Protocol name for the new wallet UI.")
    category: str = Field(..., description="Protocol category such as lending or DEX.")
    chain: str = Field(..., description="Primary chain for the protocol position.")
    position_summary: str = Field(..., description="Short summary of the wallet position.")
    position_usd: float = Field(..., description="Estimated USD value of the protocol position.")
    status: str = Field(..., description="Position status such as active or monitoring.")
    risk_level: str = Field(..., description="Risk label for the position.")
    apr: float = Field(..., description="Estimated APR for the position.")


class WalletOverviewResponse(BaseModel):
    address: str = Field(..., description="Wallet address used for the overview.")
    total_usd_value: float = Field(..., description="Total USD value across all assets.")
    total_change_24h: float = Field(..., description="24-hour value change in USD.")
    total_change_pct_24h: float = Field(..., description="24-hour value change in percentage.")
    pricing_source: str = Field(..., description="Source used for current asset pricing.")
    last_updated_at: str = Field(..., description="ISO 8601 UTC timestamp for the pricing snapshot.")
    wallet_sections: list[WalletSectionSchema] = Field(
        default_factory=list,
        description="Wallet sections grouped for exchange-style rendering.",
    )
    quick_actions: list[QuickActionSchema] = Field(
        default_factory=list,
        description="Structured quick actions for the wallet page.",
    )
    assets: list[WalletAssetSchema] = Field(
        default_factory=list,
        description="Asset positions visible in the wallet overview.",
    )
    protocols: list[WalletProtocolSchema] = Field(
        default_factory=list,
        description="Protocol interactions or positions associated with the wallet.",
    )
    ai_summary: str = Field(..., description="Natural-language summary for the wallet.")


AssetItem = WalletAssetSchema
ProtocolOverviewItem = WalletProtocolSchema
