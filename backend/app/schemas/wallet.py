from pydantic import BaseModel


class AssetItem(BaseModel):
    symbol: str
    name: str
    balance: float
    usd_value: float
    chain: str


class ProtocolOverviewItem(BaseModel):
    name: str
    category: str
    position_summary: str


class WalletOverviewResponse(BaseModel):
    address: str
    total_usd_value: float
    assets: list[AssetItem]
    protocols: list[ProtocolOverviewItem]
    ai_summary: str
