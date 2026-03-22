import { formatCurrency, formatTokenAmount } from "@/lib/format";
import type { AssetItem } from "@/types/api";

type AssetsCardProps = {
  assets: AssetItem[];
};

export function AssetsCard({ assets }: AssetsCardProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="panel-label">Assets</p>
          <h2>Token balances</h2>
        </div>
      </div>

      {assets.length === 0 ? (
        <p className="empty-copy">No assets in this wallet yet.</p>
      ) : (
        <div className="asset-list">
          {assets.map((asset) => (
            <article className="list-row" key={`${asset.chain}-${asset.symbol}`}>
              <div>
                <strong>
                  {asset.symbol} <span className="muted-inline">{asset.name}</span>
                </strong>
                <p>{asset.chain}</p>
              </div>
              <div className="row-values">
                <strong>{formatCurrency(asset.usd_value)}</strong>
                <p>{formatTokenAmount(asset.balance)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
