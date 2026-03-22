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
    <header className="hero-card wallet-header">
      <div>
        <p className="eyebrow">Stage 1 MVP</p>
        <h1 className="hero-title">AI DeFi Wallet</h1>
        <p className="hero-copy">
          Simulate a wallet connection and preview a portfolio snapshot, protocol activity,
          and an AI summary from mock backend data.
        </p>
        {isEmptyDemo ? (
          <p className="hero-note">
            Empty demo mode is active. Click connect to preview the empty state flow.
          </p>
        ) : null}
      </div>

      <div className="wallet-actions">
        <button className="primary-button" onClick={onConnect} type="button">
          {isLoading ? "Loading..." : isConnected ? "Refresh wallet" : "Connect wallet"}
        </button>

        <div className="address-chip">
          <span className="address-label">Current address</span>
          <span className="address-value">{address ?? "Not connected"}</span>
        </div>
      </div>
    </header>
  );
}
