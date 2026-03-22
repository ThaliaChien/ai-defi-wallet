from fastapi.testclient import TestClient

from app.main import app
from app.services.wallet import DEMO_ADDRESS, EMPTY_ADDRESS
from app.services.wallet import price_provider

client = TestClient(app)

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


def test_health_endpoint_returns_200() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "backend",
        "version": "0.1.0",
    }


def test_wallet_overview_endpoint_returns_200_and_complete_shape(monkeypatch) -> None:
    monkeypatch.setattr(price_provider, "_request_simple_price", lambda ids: _fake_price_payload())

    response = client.get("/api/v1/wallet/overview")

    assert response.status_code == 200

    payload = response.json()
    assert payload.keys() == EXPECTED_OVERVIEW_KEYS
    assert payload["address"] == DEMO_ADDRESS
    assert payload["pricing_source"] == "coingecko_live"
    assert isinstance(payload["wallet_sections"], list)
    assert isinstance(payload["quick_actions"], list)
    assert payload["assets"]
    assert payload["protocols"]
    assert payload["assets"][0].keys() == EXPECTED_ASSET_KEYS
    assert payload["protocols"][0].keys() == EXPECTED_PROTOCOL_KEYS


def test_wallet_overview_endpoint_returns_empty_shape_for_empty_address(monkeypatch) -> None:
    monkeypatch.setattr(price_provider, "_request_simple_price", lambda ids: _fake_price_payload())

    response = client.get(
        "/api/v1/wallet/overview",
        params={"address": EMPTY_ADDRESS},
    )

    assert response.status_code == 200

    payload = response.json()
    assert payload["address"] == EMPTY_ADDRESS
    assert payload["assets"] == []
    assert payload["protocols"] == []
    assert payload["wallet_sections"] == []
    assert payload["total_usd_value"] == 0
    assert isinstance(payload["ai_summary"], str)


def test_wallet_overview_endpoint_falls_back_when_price_provider_fails(monkeypatch) -> None:
    def fail_request(ids: list[str]) -> dict[str, dict[str, float]]:
        raise RuntimeError("price source unavailable")

    monkeypatch.setattr(price_provider, "_request_simple_price", fail_request)

    response = client.get("/api/v1/wallet/overview")

    assert response.status_code == 200
    payload = response.json()
    assert payload["pricing_source"] == "mock_fallback"
    assert payload["assets"][0]["symbol"] == "ETH"
