export type HealthResponse = {
  status: string;
  service: string;
  version: string;
};

export type AssetItem = {
  symbol: string;
  name: string;
  balance: number;
  usd_value: number;
  chain: string;
};

export type ProtocolOverviewItem = {
  name: string;
  category: string;
  position_summary: string;
};

export type WalletOverviewResponse = {
  address: string;
  total_usd_value: number;
  assets: AssetItem[];
  protocols: ProtocolOverviewItem[];
  ai_summary: string;
};
