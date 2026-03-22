import { formatCurrency } from "@/lib/format";

type OverviewCardProps = {
  totalUsdValue: number;
  assetCount: number;
  protocolCount: number;
};

export function OverviewCard({
  totalUsdValue,
  assetCount,
  protocolCount,
}: OverviewCardProps) {
  return (
    <section className="panel overview-card">
      <div>
        <p className="panel-label">Total portfolio value</p>
        <h2 className="overview-total">{formatCurrency(totalUsdValue)}</h2>
      </div>

      <div className="overview-metrics">
        <div>
          <span className="metric-label">Assets</span>
          <strong>{assetCount}</strong>
        </div>
        <div>
          <span className="metric-label">Protocols</span>
          <strong>{protocolCount}</strong>
        </div>
      </div>
    </section>
  );
}
