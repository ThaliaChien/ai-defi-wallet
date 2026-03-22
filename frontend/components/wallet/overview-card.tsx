import { formatCurrency, truncateAddress } from "@/lib/format";

type OverviewCardProps = {
  address: string;
  totalUsdValue: number;
  assetCount: number;
  protocolCount: number;
};

export function OverviewCard({
  address,
  totalUsdValue,
  assetCount,
  protocolCount,
}: OverviewCardProps) {
  return (
    <section className="overview-section">
      <article className="overview-primary-card panel">
        <div className="overview-primary-head">
          <div>
            <p className="panel-label">Total portfolio value</p>
            <h2 className="overview-total">{formatCurrency(totalUsdValue)}</h2>
          </div>
          <div className="overview-chip">{truncateAddress(address)}</div>
        </div>

        <p className="overview-supporting-copy">
          Consolidated value across wallet balances and protocol-linked positions available in the current portfolio snapshot.
        </p>
      </article>

      <article className="metric-card panel">
        <p className="metric-label">Tracked assets</p>
        <strong className="metric-value">{assetCount}</strong>
        <p className="metric-copy">Distinct token lines included in the wallet overview.</p>
      </article>

      <article className="metric-card panel">
        <p className="metric-label">Protocol exposure</p>
        <strong className="metric-value">{protocolCount}</strong>
        <p className="metric-copy">Protocols with recent positions or activity context.</p>
      </article>

      <article className="metric-card panel">
        <p className="metric-label">Insight layer</p>
        <strong className="metric-value">AI</strong>
        <p className="metric-copy">Narrative summary generated from the same overview dataset.</p>
      </article>
    </section>
  );
}
