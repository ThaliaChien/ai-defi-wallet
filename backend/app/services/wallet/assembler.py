from app.schemas.wallet import (
    AssetActionHintSchema,
    QuickActionSchema,
    WalletAssetSchema,
    WalletOverviewResponse,
    WalletProtocolSchema,
    WalletSectionSchema,
)
from app.services.wallet.asset_registry import get_asset_registry_entry
from app.services.wallet.price_provider import get_pricing_bundle
from app.services.wallet.types import MockWalletOverviewData

WALLET_SECTION_LABELS = {
    "spot": "Spot Wallet",
    "earn": "Earn Wallet",
    "defi": "DeFi Wallet",
}


def _build_wallet_sections(assets: list[WalletAssetSchema]) -> list[WalletSectionSchema]:
    grouped: dict[str, dict[str, float | int]] = {}

    for asset in assets:
        bucket = grouped.setdefault(
            asset.wallet_type,
            {"total_usd_value": 0.0, "asset_count": 0},
        )
        bucket["total_usd_value"] = float(bucket["total_usd_value"]) + asset.usd_value
        bucket["asset_count"] = int(bucket["asset_count"]) + 1

    sections = [
        WalletSectionSchema(
            key=wallet_type,
            label=WALLET_SECTION_LABELS.get(wallet_type, wallet_type.title()),
            wallet_type=wallet_type,
            total_usd_value=round(float(values["total_usd_value"]), 2),
            asset_count=int(values["asset_count"]),
        )
        for wallet_type, values in grouped.items()
    ]
    return sorted(sections, key=lambda item: item.total_usd_value, reverse=True)


def build_wallet_overview_response(
    overview_data: MockWalletOverviewData,
) -> WalletOverviewResponse:
    pricing_bundle = get_pricing_bundle([asset.symbol for asset in overview_data.assets])

    raw_assets: list[WalletAssetSchema] = []
    for asset in overview_data.assets:
        registry_entry = get_asset_registry_entry(asset.symbol)
        price_snapshot = pricing_bundle.prices[asset.symbol]
        usd_value = round(asset.balance * price_snapshot.price_usd, 2)
        raw_assets.append(
            WalletAssetSchema(
                symbol=asset.symbol,
                name=asset.name,
                icon=registry_entry.icon,
                chain=asset.chain,
                balance=asset.balance,
                available_balance=asset.available_balance,
                locked_balance=asset.locked_balance,
                price_usd=round(price_snapshot.price_usd, 6),
                change_24h=round(price_snapshot.change_24h, 2),
                usd_value=usd_value,
                allocation_pct=0.0,
                wallet_type=asset.wallet_type,
                is_yielding=asset.is_yielding,
                action_hints=[
                    AssetActionHintSchema(
                        key=hint.key,
                        label=hint.label,
                        type=hint.type,
                        enabled=hint.enabled,
                    )
                    for hint in asset.action_hints
                ],
            )
        )

    total_usd_value = round(sum(asset.usd_value for asset in raw_assets), 2)
    total_change_24h = round(
        sum(asset.usd_value * (asset.change_24h / 100) for asset in raw_assets),
        2,
    )
    total_change_pct_24h = round(
        (total_change_24h / total_usd_value * 100) if total_usd_value else 0.0,
        2,
    )

    assets = [
        asset.model_copy(
            update={
                "allocation_pct": round(
                    (asset.usd_value / total_usd_value * 100) if total_usd_value else 0.0,
                    2,
                )
            }
        )
        for asset in raw_assets
    ]

    protocols = [
        WalletProtocolSchema(
            name=protocol.name,
            protocol=protocol.protocol,
            category=protocol.category,
            chain=protocol.chain,
            position_summary=protocol.position_summary,
            position_usd=protocol.position_usd,
            status=protocol.status,
            risk_level=protocol.risk_level,
            apr=protocol.apr,
        )
        for protocol in overview_data.protocols
    ]

    quick_actions = [
        QuickActionSchema(
            key=action.key,
            label=action.label,
            type=action.type,
            enabled=action.enabled,
        )
        for action in overview_data.quick_actions
    ]

    return WalletOverviewResponse(
        address=overview_data.address,
        total_usd_value=total_usd_value,
        total_change_24h=total_change_24h,
        total_change_pct_24h=total_change_pct_24h,
        pricing_source=pricing_bundle.pricing_source,
        last_updated_at=pricing_bundle.last_updated_at,
        wallet_sections=_build_wallet_sections(assets),
        quick_actions=quick_actions,
        assets=assets,
        protocols=protocols,
        ai_summary=overview_data.summary_text,
    )
