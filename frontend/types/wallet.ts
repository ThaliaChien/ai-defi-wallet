import type { ProtocolOverviewItem } from "@/types/api";

export type WalletTab = "overview" | "assets" | "earn" | "activity";

export type WalletAssetRow = {
  symbol: string;
  name: string;
  chain: string;
  balance: number;
  available: number;
  price: number;
  dayChangePercent: number;
  usdValue: number;
  allocation: number;
};

export type WalletAllocationSlice = {
  label: string;
  value: number;
  percentage: number;
};

export type WalletSummaryMetrics = {
  totalValue: number;
  availableValue: number;
  deployedValue: number;
  protocolCount: number;
  assetCount: number;
  dayChangeValue: number;
  dayChangePercent: number;
};

export type WalletRiskSummary = {
  label: string;
  level: "Low" | "Medium" | "High";
  description: string;
};

export type WalletActivityItem = {
  title: string;
  subtitle: string;
  timestamp: string;
  status: "Completed" | "Pending";
  amount: string;
};

export type WalletCenterViewModel = {
  address: string;
  aiSummary: string;
  assetRows: WalletAssetRow[];
  allocation: WalletAllocationSlice[];
  summary: WalletSummaryMetrics;
  riskItems: WalletRiskSummary[];
  activityItems: WalletActivityItem[];
  protocols: ProtocolOverviewItem[];
};
