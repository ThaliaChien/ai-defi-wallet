import type { WalletOverviewResponse } from "@/types/api";
import type {
  WalletActivityItem,
  WalletAllocationSlice,
  WalletAssetRow,
  WalletCenterViewModel,
  WalletRiskSummary,
  WalletTab,
} from "@/types/wallet";

export const WALLET_TABS: Array<{ id: WalletTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "assets", label: "Assets" },
  { id: "earn", label: "Earn" },
  { id: "activity", label: "Activity" },
];

export const QUICK_ACTIONS = ["Deposit", "Withdraw", "Transfer", "Swap", "Earn"] as const;

const ASSET_METADATA: Record<string, { availableRatio: number; dayChangePercent: number }> = {
  ETH: { availableRatio: 0.9, dayChangePercent: 2.48 },
  USDC: { availableRatio: 0.97, dayChangePercent: 0.02 },
  ARB: { availableRatio: 0.86, dayChangePercent: -1.67 },
};

const STABLE_SYMBOLS = new Set(["USDC", "USDT", "DAI"]);

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildAssetRows(overview: WalletOverviewResponse): WalletAssetRow[] {
  return [...overview.assets]
    .sort((left, right) => right.usd_value - left.usd_value)
    .map((asset) => {
      const metadata = ASSET_METADATA[asset.symbol] ?? {
        availableRatio: 0.88,
        dayChangePercent: 0,
      };
      const price = asset.balance > 0 ? asset.usd_value / asset.balance : 0;
      const available = asset.balance * metadata.availableRatio;
      const allocation = overview.total_usd_value > 0 ? asset.usd_value / overview.total_usd_value : 0;

      return {
        symbol: asset.symbol,
        name: asset.name,
        chain: asset.chain,
        balance: asset.balance,
        available: round(available),
        price: round(price),
        dayChangePercent: metadata.dayChangePercent,
        usdValue: asset.usd_value,
        allocation,
      };
    });
}

function buildAllocation(rows: WalletAssetRow[]): WalletAllocationSlice[] {
  return rows.map((row) => ({
    label: row.symbol,
    value: row.usdValue,
    percentage: round(row.allocation * 100),
  }));
}

function buildRiskItems(rows: WalletAssetRow[], protocolCount: number): WalletRiskSummary[] {
  const topAllocation = rows[0]?.allocation ?? 0;
  const stableShare = rows
    .filter((row) => STABLE_SYMBOLS.has(row.symbol))
    .reduce((sum, row) => sum + row.allocation, 0);
  const uniqueChains = new Set(rows.map((row) => row.chain)).size;

  return [
    {
      label: "Concentration",
      level: topAllocation > 0.55 ? "High" : topAllocation > 0.35 ? "Medium" : "Low",
      description:
        topAllocation > 0.55
          ? "Portfolio value is concentrated in a single asset."
          : topAllocation > 0.35
            ? "One asset remains the primary allocation driver."
            : "Allocation is relatively distributed across tracked assets.",
    },
    {
      label: "Stablecoin profile",
      level: stableShare > 0.6 ? "Low" : stableShare > 0.3 ? "Medium" : "High",
      description:
        stableShare > 0.6
          ? "Stablecoin weight reduces directional market beta."
          : stableShare > 0.3
            ? "Portfolio holds a balanced share of defensive liquidity."
            : "Portfolio is mostly directional and less shielded by stables.",
    },
    {
      label: "Protocol diversification",
      level: protocolCount >= 3 && uniqueChains >= 3 ? "Low" : protocolCount >= 2 ? "Medium" : "High",
      description:
        protocolCount >= 3 && uniqueChains >= 3
          ? "Protocol and chain exposure are diversified for this dataset."
          : protocolCount >= 2
            ? "Protocol footprint is present but still moderately concentrated."
            : "Protocol exposure is narrow and more sensitive to single-source risk.",
    },
  ];
}

function buildActivityItems(overview: WalletOverviewResponse, rows: WalletAssetRow[]): WalletActivityItem[] {
  if (rows.length === 0 && overview.protocols.length === 0) {
    return [];
  }

  const topAsset = rows[0];
  const secondAsset = rows[1];
  const firstProtocol = overview.protocols[0];
  const secondProtocol = overview.protocols[1];

  return [
    topAsset
      ? {
          title: `Rebalanced ${topAsset.symbol} wallet exposure`,
          subtitle: `Internal wallet movement on ${topAsset.chain}`,
          timestamp: "2 hours ago",
          status: "Completed",
          amount: `$${round(topAsset.usdValue * 0.18)}`,
        }
      : null,
    firstProtocol
      ? {
          title: `Position updated on ${firstProtocol.name}`,
          subtitle: firstProtocol.position_summary,
          timestamp: "5 hours ago",
          status: "Completed",
          amount: secondAsset ? `$${round(secondAsset.usdValue * 0.24)}` : "$0",
        }
      : null,
    secondAsset
      ? {
          title: `Transferred ${secondAsset.symbol} into active balance`,
          subtitle: `Available balance refreshed for ${secondAsset.chain}`,
          timestamp: "Yesterday",
          status: "Completed",
          amount: `$${round(secondAsset.usdValue * 0.12)}`,
        }
      : null,
    secondProtocol
      ? {
          title: `${secondProtocol.name} exposure reviewed`,
          subtitle: secondProtocol.position_summary,
          timestamp: "2 days ago",
          status: "Pending",
          amount: "Review",
        }
      : null,
  ].filter((item): item is WalletActivityItem => item !== null);
}

export function buildWalletCenterViewModel(overview: WalletOverviewResponse): WalletCenterViewModel {
  const assetRows = buildAssetRows(overview);
  const allocation = buildAllocation(assetRows);
  const availableValue = round(assetRows.reduce((sum, row) => sum + row.available * row.price, 0));
  const dayChangeValue = round(
    assetRows.reduce((sum, row) => sum + row.usdValue * (row.dayChangePercent / 100), 0),
  );

  return {
    address: overview.address,
    aiSummary: overview.ai_summary,
    assetRows,
    allocation,
    summary: {
      totalValue: overview.total_usd_value,
      availableValue,
      deployedValue: round(Math.max(overview.total_usd_value - availableValue, 0)),
      protocolCount: overview.protocols.length,
      assetCount: assetRows.length,
      dayChangeValue,
      dayChangePercent:
        overview.total_usd_value > 0 ? round((dayChangeValue / overview.total_usd_value) * 100) : 0,
    },
    riskItems: buildRiskItems(assetRows, overview.protocols.length),
    activityItems: buildActivityItems(overview, assetRows),
    protocols: overview.protocols,
  };
}
