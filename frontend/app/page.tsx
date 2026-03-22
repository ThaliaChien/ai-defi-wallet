"use client";

import { useEffect, useState } from "react";

import { AiSummaryCard } from "@/components/wallet/ai-summary-card";
import { AssetsCard } from "@/components/wallet/assets-card";
import { OverviewCard } from "@/components/wallet/overview-card";
import { ProtocolsCard } from "@/components/wallet/protocols-card";
import { WalletHeader } from "@/components/wallet/wallet-header";
import { WalletState } from "@/components/wallet/wallet-state";
import { fetchWalletOverview } from "@/lib/api";
import {
  DEMO_WALLET_ADDRESS,
  EMPTY_DEMO_WALLET_ADDRESS,
  isWalletOverviewEmpty,
} from "@/lib/wallet";
import type { WalletOverviewResponse } from "@/types/api";

type ViewState = "idle" | "loading" | "success" | "error" | "empty";

export default function HomePage() {
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [overview, setOverview] = useState<WalletOverviewResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmptyDemo, setIsEmptyDemo] = useState(false);

  const demoAddress = isEmptyDemo ? EMPTY_DEMO_WALLET_ADDRESS : DEMO_WALLET_ADDRESS;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEmptyDemo(params.get("demo") === "empty");
  }, []);

  async function loadWalletOverview(address: string) {
    setViewState("loading");
    setOverview(null);
    setErrorMessage(null);

    try {
      const data = await fetchWalletOverview(address);
      setOverview(data);
      setViewState(isWalletOverviewEmpty(data) ? "empty" : "success");
    } catch (error) {
      setOverview(null);
      setViewState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while loading wallet overview.",
      );
    }
  }

  function handleConnectWallet() {
    setWalletAddress(demoAddress);
    void loadWalletOverview(demoAddress);
  }

  function handleRetry() {
    const nextAddress = walletAddress ?? demoAddress;
    setWalletAddress(nextAddress);
    void loadWalletOverview(nextAddress);
  }

  return (
    <main className="wallet-page">
      <div className="wallet-shell">
        <WalletHeader
          address={walletAddress}
          isConnected={walletAddress !== null}
          isEmptyDemo={isEmptyDemo}
          isLoading={viewState === "loading"}
          onConnect={handleConnectWallet}
        />

        {overview ? (
          <OverviewCard
            assetCount={overview.assets.length}
            protocolCount={overview.protocols.length}
            totalUsdValue={overview.total_usd_value}
          />
        ) : null}

        {viewState === "idle" ? (
          <WalletState
            title="Connect a demo wallet"
            description="Start the MVP flow by simulating a wallet connection. The page will then load mock portfolio data from the FastAPI backend."
            actionLabel="Connect wallet"
            onAction={handleConnectWallet}
          />
        ) : null}

        {viewState === "loading" ? (
          <WalletState
            title="Loading wallet overview"
            description="Fetching mock assets, protocol activity, and AI summary from the backend."
          />
        ) : null}

        {viewState === "error" ? (
          <WalletState
            title="Unable to load wallet overview"
            description={errorMessage ?? "Please retry the demo request."}
            actionLabel="Retry"
            onAction={handleRetry}
          />
        ) : null}

        {viewState === "empty" && overview ? (
          <>
            <WalletState
              title="No assets found in this demo wallet"
              description="This reserved address returns an empty portfolio so you can verify the empty state without changing backend code."
              actionLabel="Reload"
              onAction={handleRetry}
            />
            <section className="wallet-grid">
              <AssetsCard assets={overview.assets} />
              <div className="wallet-side-column">
                <ProtocolsCard protocols={overview.protocols} />
                <AiSummaryCard summary={overview.ai_summary} />
              </div>
            </section>
          </>
        ) : null}

        {viewState === "success" && overview ? (
          <section className="wallet-grid">
            <AssetsCard assets={overview.assets} />
            <div className="wallet-side-column">
              <ProtocolsCard protocols={overview.protocols} />
              <AiSummaryCard summary={overview.ai_summary} />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
