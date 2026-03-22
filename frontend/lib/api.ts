import { apiConfig } from "@/lib/config";
import type { HealthResponse, WalletOverviewResponse } from "@/types/api";

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${apiConfig.baseUrl}/api/v1/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch backend health status.");
  }

  return response.json() as Promise<HealthResponse>;
}

export async function fetchWalletOverview(
  address?: string,
): Promise<WalletOverviewResponse> {
  const searchParams = new URLSearchParams();

  if (address) {
    searchParams.set("address", address);
  }

  const query = searchParams.toString();
  const url = `${apiConfig.baseUrl}/api/v1/wallet/overview${query ? `?${query}` : ""}`;
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wallet overview.");
  }

  return response.json() as Promise<WalletOverviewResponse>;
}
