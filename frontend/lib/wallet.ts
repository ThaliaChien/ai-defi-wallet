import type { WalletOverviewResponse } from "@/types/api";

export const DEMO_WALLET_ADDRESS = "0x4F3cA5b2C9E7D1a4eB8f2d6A1c3E9b7D5f1A2C4E";
export const EMPTY_DEMO_WALLET_ADDRESS = "0x0000000000000000000000000000000000000000";

export function isWalletOverviewEmpty(data: WalletOverviewResponse): boolean {
  return data.assets.length === 0 && data.protocols.length === 0;
}
