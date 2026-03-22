"use client";

import { useEffect, useState } from "react";

import { WalletActionBar } from "@/components/wallet/wallet-action-bar";
import { WalletActivityCard } from "@/components/wallet/wallet-activity-card";
import { WalletAiInsightCard } from "@/components/wallet/wallet-ai-insight-card";
import { WalletAllocationCard } from "@/components/wallet/wallet-allocation-card";
import { WalletAssetsTable } from "@/components/wallet/wallet-assets-table";
import { WalletProtocolsCard } from "@/components/wallet/wallet-protocols-card";
import { WalletRiskCard } from "@/components/wallet/wallet-risk-card";
import { WalletSkeleton } from "@/components/wallet/wallet-skeleton";
import { WalletStateShell } from "@/components/wallet/wallet-state-shell";
import { WalletSummaryBar } from "@/components/wallet/wallet-summary-bar";
import { WalletTopbar } from "@/components/wallet/wallet-topbar";
import { fetchWalletOverview } from "@/lib/api";
import { buildWalletCenterViewModel } from "@/lib/wallet-center";
import {
  DEMO_WALLET_ADDRESS,
  EMPTY_DEMO_WALLET_ADDRESS,
  isWalletOverviewEmpty,
} from "@/lib/wallet";
import type { WalletOverviewResponse } from "@/types/api";
import type { WalletCenterViewModel, WalletTab } from "@/types/wallet";

type ViewState = "idle" | "loading" | "success" | "error" | "empty";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<WalletTab>("overview");
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [overview, setOverview] = useState<WalletOverviewResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmptyDemo, setIsEmptyDemo] = useState(false);

  const demoAddress = isEmptyDemo ? EMPTY_DEMO_WALLET_ADDRESS : DEMO_WALLET_ADDRESS;
  const walletView: WalletCenterViewModel | null = overview
    ? buildWalletCenterViewModel(overview)
    : null;

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
        error instanceof Error ? error.message : "Failed to load wallet overview.",
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

  function renderPrimaryPanel() {
    if (viewState === "loading") {
      return null;
    }

    if (viewState === "idle") {
      return (
        <section className="wallet-panel panel-shell">
          <div className="wallet-panel__header">
            <div>
              <p className="section-kicker">Asset Balances</p>
              <h2 className="section-title">Asset Table</h2>
            </div>
          </div>
          <WalletStateShell
            actionLabel="Connect Wallet"
            description="Connect the demo wallet to load balances, availability, pricing, and allocation data."
            onAction={handleConnectWallet}
            title="Connect wallet to view assets"
            variant="idle"
          />
        </section>
      );
    }

    if (viewState === "error") {
      return (
        <section className="wallet-panel panel-shell">
          <div className="wallet-panel__header">
            <div>
              <p className="section-kicker">Asset Balances</p>
              <h2 className="section-title">Asset Table</h2>
            </div>
          </div>
          <WalletStateShell
            actionLabel="Retry"
            description={errorMessage ?? "The overview request did not complete successfully."}
            onAction={handleRetry}
            title="Failed to load wallet overview"
            variant="error"
          />
        </section>
      );
    }

    if (activeTab === "earn") {
      return <WalletProtocolsCard mode="focus" protocols={walletView?.protocols ?? []} />;
    }

    if (activeTab === "activity") {
      return <WalletActivityCard items={walletView?.activityItems ?? []} mode="focus" />;
    }

    return <WalletAssetsTable rows={walletView?.assetRows ?? []} />;
  }

  function renderBottomLeft() {
    if (viewState === "loading") {
      return null;
    }

    if (activeTab === "earn") {
      return <WalletAssetsTable mode="compact" rows={walletView?.assetRows ?? []} />;
    }

    return <WalletProtocolsCard protocols={walletView?.protocols ?? []} />;
  }

  function renderBottomRight() {
    if (viewState === "loading") {
      return null;
    }

    if (activeTab === "activity") {
      return <WalletAssetsTable mode="compact" rows={walletView?.assetRows ?? []} />;
    }

    return <WalletActivityCard items={walletView?.activityItems ?? []} />;
  }

  return (
    <main className="wallet-page wallet-page--exchange">
      <div className="wallet-shell">
        <WalletTopbar
          activeTab={activeTab}
          address={walletAddress}
          isConnected={walletAddress !== null}
          isLoading={viewState === "loading"}
          onConnect={handleConnectWallet}
          onTabChange={setActiveTab}
        />

        <WalletSummaryBar state={viewState} summary={walletView?.summary ?? null} />

        <WalletActionBar isConnected={walletAddress !== null} />

        {viewState === "loading" ? (
          <WalletSkeleton activeTab={activeTab} />
        ) : (
          <>
            <section className="wallet-main-grid">
              <div className="wallet-main-grid__primary">
                {viewState === "empty" ? (
                  <WalletStateShell
                    actionLabel="Reload"
                    description="The reserved demo address returned an empty wallet. The asset center remains available for empty-state validation."
                    onAction={handleRetry}
                    title="No assets available for this address"
                    variant="empty"
                  />
                ) : null}
                {renderPrimaryPanel()}
              </div>

              <div className="wallet-main-grid__secondary">
                <WalletAllocationCard slices={walletView?.allocation ?? []} />
                <WalletAiInsightCard
                  dominantAsset={walletView?.assetRows[0]?.symbol ?? null}
                  protocolCount={walletView?.summary.protocolCount ?? 0}
                  summary={walletView?.aiSummary ?? null}
                />
                <WalletRiskCard items={walletView?.riskItems ?? []} />
              </div>
            </section>

            <section className="wallet-bottom-grid">
              {renderBottomLeft()}
              {renderBottomRight()}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
