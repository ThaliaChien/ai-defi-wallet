import type { WalletRiskSummary } from "@/types/wallet";

type WalletRiskCardProps = {
  items: WalletRiskSummary[];
};

export function WalletRiskCard({ items }: WalletRiskCardProps) {
  return (
    <section className="wallet-panel panel-shell">
      <div className="wallet-panel__header">
        <div>
          <p className="section-kicker">Risk Monitor</p>
          <h2 className="section-title">Portfolio Risks</h2>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="panel-empty-copy">Risk indicators will populate once a portfolio is loaded.</p>
      ) : (
        <div className="risk-list">
          {items.map((item) => (
            <article className="risk-list__row" key={item.label}>
              <div>
                <strong>{item.label}</strong>
                <p>{item.description}</p>
              </div>
              <span
                className={
                  item.level === "Low"
                    ? "risk-chip risk-chip--low"
                    : item.level === "Medium"
                      ? "risk-chip risk-chip--medium"
                      : "risk-chip risk-chip--high"
                }
              >
                {item.level}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
