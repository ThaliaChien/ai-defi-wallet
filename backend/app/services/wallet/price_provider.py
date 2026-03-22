from datetime import datetime, timedelta, timezone

import httpx

from app.core.config import settings
from app.services.wallet.asset_registry import get_asset_registry_entry
from app.services.wallet.types import AssetPriceSnapshot, PricingBundle

_PRICE_CACHE: dict[str, tuple[datetime, PricingBundle]] = {}


def clear_price_cache() -> None:
    _PRICE_CACHE.clear()


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _isoformat(value: datetime) -> str:
    return value.isoformat().replace("+00:00", "Z")


def _cache_key(symbols: list[str]) -> str:
    return ",".join(sorted(set(symbols)))


def _request_simple_price(coingecko_ids: list[str]) -> dict[str, dict[str, float]]:
    headers = {"accept": "application/json"}
    if settings.coingecko_api_key:
        headers["x-cg-demo-api-key"] = settings.coingecko_api_key

    response = httpx.get(
        f"{settings.coingecko_base_url}/simple/price",
        params={
            "ids": ",".join(coingecko_ids),
            "vs_currencies": "usd",
            "include_24hr_change": "true",
        },
        headers=headers,
        timeout=settings.coingecko_timeout_seconds,
    )
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, dict):
        raise ValueError("CoinGecko price response must be a JSON object.")
    return payload


def _build_fallback_bundle(symbols: list[str]) -> PricingBundle:
    now = _utc_now()
    prices = {
        symbol: AssetPriceSnapshot(
            price_usd=get_asset_registry_entry(symbol).fallback_price_usd,
            change_24h=get_asset_registry_entry(symbol).fallback_change_24h,
        )
        for symbol in symbols
    }
    return PricingBundle(
        prices=prices,
        pricing_source="mock_fallback",
        last_updated_at=_isoformat(now),
    )


def _build_live_bundle(symbols: list[str], payload: dict[str, dict[str, float]]) -> PricingBundle:
    now = _utc_now()
    prices: dict[str, AssetPriceSnapshot] = {}

    for symbol in symbols:
        entry = get_asset_registry_entry(symbol)
        price_data = payload.get(entry.coingecko_id, {})
        price_usd = float(price_data.get("usd", entry.fallback_price_usd))
        change_24h = float(
            price_data.get("usd_24h_change", entry.fallback_change_24h)
        )
        prices[symbol] = AssetPriceSnapshot(
            price_usd=price_usd,
            change_24h=change_24h,
        )

    return PricingBundle(
        prices=prices,
        pricing_source="coingecko_live",
        last_updated_at=_isoformat(now),
    )


def get_pricing_bundle(symbols: list[str]) -> PricingBundle:
    normalized_symbols = sorted(set(symbols))
    if not normalized_symbols:
        return _build_fallback_bundle([])

    cache_key = _cache_key(normalized_symbols)
    now = _utc_now()
    cached = _PRICE_CACHE.get(cache_key)

    if cached and cached[0] > now:
        return PricingBundle(
            prices=cached[1].prices,
            pricing_source="coingecko_cached",
            last_updated_at=cached[1].last_updated_at,
        )

    try:
        payload = _request_simple_price(
            [get_asset_registry_entry(symbol).coingecko_id for symbol in normalized_symbols]
        )
        bundle = _build_live_bundle(normalized_symbols, payload)
        expires_at = now + timedelta(seconds=settings.coingecko_cache_ttl_seconds)
        _PRICE_CACHE[cache_key] = (expires_at, bundle)
        return bundle
    except Exception:
        if cached:
            return PricingBundle(
                prices=cached[1].prices,
                pricing_source="coingecko_cached",
                last_updated_at=cached[1].last_updated_at,
            )
        return _build_fallback_bundle(normalized_symbols)
