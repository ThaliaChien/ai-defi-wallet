from app.services.wallet import DEMO_ADDRESS, EMPTY_ADDRESS, get_wallet_overview
from app.services.wallet import price_provider


EXPECTED_OVERVIEW_KEYS = {
    "address",
    "total_usd_value",
    "total_change_24h",
    "total_change_pct_24h",
    "pricing_source",
    "last_updated_at",
    "wallet_sections",
    "quick_actions",
    "assets",
    "protocols",
    "ai_summary",
}

EXPECTED_ASSET_KEYS = {
    "symbol",
    "name",
    "icon",
    "chain",
    "balance",
    "available_balance",
    "locked_balance",
    "price_usd",
    "change_24h",
    "usd_value",
    "allocation_pct",
    "wallet_type",
    "is_yielding",
    "action_hints",
}

EXPECTED_PROTOCOL_KEYS = {
    "name",
    "protocol",
    "category",
    "chain",
    "position_summary",
    "position_usd",
    "status",
    "risk_level",
    "apr",
}


def _fake_price_payload() -> dict[str, dict[str, float]]:
    return {
        "ethereum": {"usd": 3500.0, "usd_24h_change": 2.5},
        "usd-coin": {"usd": 1.0, "usd_24h_change": 0.0},
        "arbitrum": {"usd": 0.9, "usd_24h_change": -1.5},
    }


def setup_function() -> None:
    price_provider.clear_price_cache()


def test_get_wallet_overview_returns_demo_wallet_shape(monkeypatch) -> None:
    monkeypatch.setattr(price_provider, "_request_simple_price", lambda ids: _fake_price_payload())

    overview = get_wallet_overview()
    payload = overview.model_dump()

    assert payload.keys() == EXPECTED_OVERVIEW_KEYS
    assert payload["address"] == DEMO_ADDRESS
    assert payload["pricing_source"] == "coingecko_live"
    assert isinstance(payload["ai_summary"], str)
    assert isinstance(payload["wallet_sections"], list)
    assert isinstance(payload["quick_actions"], list)
    assert payload["total_usd_value"] == round(
        sum(asset["usd_value"] for asset in payload["assets"]),
        2,
    )

    first_asset = payload["assets"][0]
    assert first_asset.keys() == EXPECTED_ASSET_KEYS
    assert round(first_asset["available_balance"] + first_asset["locked_balance"], 8) == round(
        first_asset["balance"],
        8,
    )

    first_protocol = payload["protocols"][0]
    assert first_protocol.keys() == EXPECTED_PROTOCOL_KEYS
    assert first_protocol["name"] == first_protocol["protocol"]


def test_get_wallet_overview_returns_empty_shape_for_empty_address(monkeypatch) -> None:
    monkeypatch.setattr(price_provider, "_request_simple_price", lambda ids: _fake_price_payload())

    overview = get_wallet_overview(EMPTY_ADDRESS)
    payload = overview.model_dump()

    assert payload["address"] == EMPTY_ADDRESS
    assert payload["assets"] == []
    assert payload["protocols"] == []
    assert payload["wallet_sections"] == []
    assert payload["total_usd_value"] == 0


def test_get_wallet_overview_ai_summary_is_always_string(monkeypatch) -> None:
    monkeypatch.setattr(price_provider, "_request_simple_price", lambda ids: _fake_price_payload())

    demo_overview = get_wallet_overview()
    empty_overview = get_wallet_overview(EMPTY_ADDRESS)

    assert isinstance(demo_overview.ai_summary, str)
    assert isinstance(empty_overview.ai_summary, str)


def test_get_wallet_overview_uses_cached_prices_after_first_fetch(monkeypatch) -> None:
    calls = {"count": 0}

    def fake_request(ids: list[str]) -> dict[str, dict[str, float]]:
        calls["count"] += 1
        return _fake_price_payload()

    monkeypatch.setattr(price_provider, "_request_simple_price", fake_request)

    first = get_wallet_overview()
    second = get_wallet_overview()

    assert calls["count"] == 1
    assert first.pricing_source == "coingecko_live"
    assert second.pricing_source == "coingecko_cached"


def test_get_wallet_overview_falls_back_when_price_provider_fails(monkeypatch) -> None:
    def fail_request(ids: list[str]) -> dict[str, dict[str, float]]:
        raise RuntimeError("price source unavailable")

    monkeypatch.setattr(price_provider, "_request_simple_price", fail_request)

    overview = get_wallet_overview()

    assert overview.pricing_source == "mock_fallback"
    assert all(isinstance(asset.price_usd, float) for asset in overview.assets)
    assert all(isinstance(asset.change_24h, float) for asset in overview.assets)
    assert round(sum(asset.allocation_pct for asset in overview.assets), 2) == 100.0
