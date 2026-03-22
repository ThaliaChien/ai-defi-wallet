import { formatCurrency, formatTokenAmount } from "@/lib/format";
import type { AssetItem } from "@/types/api";

type AssetsCardProps = {
  assets: AssetItem[];
  totalUsdValue: number;
};

export function AssetsCard({ assets, totalUsdValue }: AssetsCardProps) {
  return (
    <section className="panel section-panel">
      <div className="section-heading">
        <div>
          <p className="panel-label">Assets</p>
          <h2>Portfolio holdings</h2>
        </div>
        <p className="section-caption">Asset balances grouped by token and execution chain.</p>
      </div>

      {assets.length === 0 ? (
        <p className="empty-copy">No balances are available for this portfolio.</p>
      ) : (
        <div className="asset-table">
          <div className="table-header asset-grid">
            <span>Asset</span>
            <span>Network</span>
            <span className="align-right">Balance</span>
            <span className="align-right">Value</span>
          </div>

          <div className="table-body">
            {assets.map((asset) => {
              const weight = totalUsdValue > 0 ? Math.round((asset.usd_value / totalUsdValue) * 100) : 0;

              return (
                <article className="asset-row asset-grid" key={`${asset.chain}-${asset.symbol}`}>
                  <div className="asset-identity">
                    <div className="asset-token-mark">{asset.symbol.slice(0, 1)}</div>
                    <div>
                      <strong>{asset.symbol}</strong>
                      <p>{asset.name}</p>
                    </div>
                  </div>
                  <span className="network-pill">{asset.chain}</span>
                  <div className="align-right">
                    <strong>{formatTokenAmount(asset.balance)}</strong>
                    <p>{weight}% allocation</p>
                  </div>
                  <div className="align-right">
                    <strong>{formatCurrency(asset.usd_value)}</strong>
                    <p>Marked to portfolio value</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
