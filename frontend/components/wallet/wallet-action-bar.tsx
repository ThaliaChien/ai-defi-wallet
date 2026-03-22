import { QUICK_ACTIONS } from "@/lib/wallet-center";

type WalletActionBarProps = {
  isConnected: boolean;
};

export function WalletActionBar({ isConnected }: WalletActionBarProps) {
  return (
    <section className="wallet-action-bar panel-shell">
      <div>
        <p className="section-kicker">Quick Actions</p>
        <h2 className="section-title">Move and manage assets</h2>
      </div>
      <div className="wallet-action-bar__buttons">
        {QUICK_ACTIONS.map((action) => (
          <button key={action} className="action-button" disabled={!isConnected} type="button">
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}
