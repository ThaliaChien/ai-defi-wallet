import { truncateAddress } from "@/lib/format";

type WalletHeaderProps = {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  isEmptyDemo: boolean;
  onConnect: () => void;
};

export function WalletHeader({
  address,
  isConnected,
  isLoading,
  isEmptyDemo,
  onConnect,
}: WalletHeaderProps) {
  return (
    <header className="topbar-shell">
      <div className="topbar-row">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            AD
          </div>
          <div>
            <p className="topbar-label">Institutional Portfolio Console</p>
            <h1 className="topbar-title">AI DeFi Wallet</h1>
          </div>
        </div>

        <div className="topbar-controls">
          <span className="status-badge">Demo Network</span>
          {isEmptyDemo ? <span className="status-badge muted">Empty Portfolio Mode</span> : null}
          <button className="primary-button" onClick={onConnect} type="button">
            {isLoading ? "Refreshing..." : isConnected ? "Refresh Portfolio" : "Connect Wallet"}
          </button>
        </div>
      </div>

      <div className="hero-panel">
        <div className="hero-content">
          <p className="eyebrow">Portfolio intelligence</p>
          <h2 className="hero-title">Monitor assets, protocol exposure, and AI insights in one workspace.</h2>
          <p className="hero-copy">
            Built for portfolio review workflows. The current experience uses mock data, but the layout and information hierarchy are designed for a production-grade Web3 dashboard.
          </p>
        </div>

        <div className="hero-sidebar">
          <div className="identity-card">
            <span className="address-label">Connected address</span>
            <strong className="identity-value">
              {address ? truncateAddress(address) : "No wallet connected"}
            </strong>
            <p className="identity-description">
              {address
                ? "Portfolio data is sourced from the wallet overview endpoint."
                : "Connect the demo wallet to load overview data."}
            </p>
          </div>

          <div className="hero-stat-row">
            <div className="hero-mini-card">
              <span className="mini-label">Session</span>
              <strong>{isConnected ? "Active" : "Idle"}</strong>
            </div>
            <div className="hero-mini-card">
              <span className="mini-label">Coverage</span>
              <strong>Wallet + Protocols + AI</strong>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
