import { truncateAddress } from "@/lib/format";
import { WALLET_TABS } from "@/lib/wallet-center";
import type { WalletTab } from "@/types/wallet";

type WalletTopbarProps = {
  activeTab: WalletTab;
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  onConnect: () => void;
  onTabChange: (tab: WalletTab) => void;
};

export function WalletTopbar({
  activeTab,
  address,
  isConnected,
  isLoading,
  onConnect,
  onTabChange,
}: WalletTopbarProps) {
  return (
    <header className="wallet-topbar panel-shell">
      <div className="wallet-topbar__brand">
        <div className="wallet-topbar__logo" aria-hidden="true">
          AW
        </div>
        <div>
          <p className="wallet-topbar__eyebrow">Wallet Center</p>
          <h1 className="wallet-topbar__title">Assets</h1>
        </div>
      </div>

      <nav aria-label="Wallet tabs" className="wallet-tabs">
        {WALLET_TABS.map((tab) => (
          <button
            key={tab.id}
            className={tab.id === activeTab ? "wallet-tab is-active" : "wallet-tab"}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="wallet-topbar__actions">
        <div className="wallet-topbar__status">
          <span className="status-chip">Demo</span>
          <span className="status-chip muted">
            {isConnected ? truncateAddress(address ?? "") : "Wallet disconnected"}
          </span>
        </div>
        <button className="primary-button" onClick={onConnect} type="button">
          {isLoading ? "Refreshing..." : isConnected ? "Refresh" : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}
