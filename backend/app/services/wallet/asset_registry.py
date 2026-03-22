from app.services.wallet.types import AssetRegistryEntry


ASSET_REGISTRY: dict[str, AssetRegistryEntry] = {
    "ETH": AssetRegistryEntry(
        coingecko_id="ethereum",
        icon="https://assets.coingecko.com/coins/images/279/small/ethereum.png",
        fallback_price_usd=3490.86,
        fallback_change_24h=2.4,
    ),
    "USDC": AssetRegistryEntry(
        coingecko_id="usd-coin",
        icon="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
        fallback_price_usd=1.0,
        fallback_change_24h=0.01,
    ),
    "ARB": AssetRegistryEntry(
        coingecko_id="arbitrum",
        icon="https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
        fallback_price_usd=0.85,
        fallback_change_24h=-1.3,
    ),
}


def get_asset_registry_entry(symbol: str) -> AssetRegistryEntry:
    try:
        return ASSET_REGISTRY[symbol]
    except KeyError as exc:
        raise KeyError(f"No asset registry entry configured for symbol: {symbol}") from exc
