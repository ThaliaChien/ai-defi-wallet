import type { WalletActivityItem } from "@/types/wallet";

type WalletActivityCardProps = {
  items: WalletActivityItem[];
  mode?: "default" | "focus";
};

export function WalletActivityCard({ items, mode = "default" }: WalletActivityCardProps) {
  const visible = mode === "focus" ? items : items.slice(0, 4);

  return (
    <section className="wallet-panel panel-shell">
      <div className="wallet-panel__header">
        <div>
          <p className="section-kicker">Recent Activity</p>
          <h2 className="section-title">
            {mode === "focus" ? "Latest Wallet Activity" : "Recent Activity"}
          </h2>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="panel-empty-copy">No recent activity is available for this address.</p>
      ) : (
        <div className="activity-list">
          {visible.map((item) => (
            <article className="activity-row" key={`${item.title}-${item.timestamp}`}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.subtitle}</p>
              </div>
              <div className="activity-row__meta">
                <strong>{item.amount}</strong>
                <p>
                  {item.status} · {item.timestamp}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
