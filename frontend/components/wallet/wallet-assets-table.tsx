import {
  formatCurrency,
  formatPercentage,
  formatSignedPercentage,
  formatTokenAmount,
} from "@/lib/format";
import type { WalletAssetRow } from "@/types/wallet";

type WalletAssetsTableProps = {
  rows: WalletAssetRow[];
  mode?: "full" | "compact";
};

export function WalletAssetsTable({ rows, mode = "full" }: WalletAssetsTableProps) {
  const visibleRows = mode === "compact" ? rows.slice(0, 4) : rows;

  return (
    <section className="wallet-panel panel-shell">
      <div className="wallet-panel__header">
        <div>
          <p className="section-kicker">Asset Balances</p>
          <h2 className="section-title">{mode === "compact" ? "Asset Summary" : "Asset Table"}</h2>
        </div>
        <p className="section-subtle">
          {mode === "compact"
            ? "Core holdings for the connected wallet."
            : "Balances and derived market metrics for each tracked asset."}
        </p>
      </div>

      <div className="wallet-table-wrap">
        <div className="wallet-assets-table">
          <div className="wallet-assets-table__head">
            <span>Asset</span>
            <span className="align-right">Balance</span>
            <span className="align-right">Available</span>
            <span className="align-right">Price</span>
            <span className="align-right">24h</span>
            <span className="align-right">Value</span>
            <span className="align-right">Allocation</span>
            <span className="align-right">Action</span>
          </div>

          {visibleRows.length === 0 ? (
            <div className="wallet-assets-table__empty">No assets available for this address.</div>
          ) : (
            visibleRows.map((row) => (
              <article className="wallet-assets-table__row" key={`${row.chain}-${row.symbol}`}>
                <div className="asset-cell">
                  <div className="asset-cell__icon">{row.symbol.slice(0, 1)}</div>
                  <div>
                    <strong>{row.symbol}</strong>
                    <p>
                      {row.name} · {row.chain}
                    </p>
                  </div>
                </div>
                <div className="align-right">
                  <strong>{formatTokenAmount(row.balance)}</strong>
                </div>
                <div className="align-right">
                  <strong>{formatTokenAmount(row.available)}</strong>
                </div>
                <div className="align-right">
                  <strong>{formatCurrency(row.price)}</strong>
                </div>
                <div className="align-right">
                  <strong
                    className={
                      row.dayChangePercent > 0
                        ? "is-positive"
                        : row.dayChangePercent < 0
                          ? "is-negative"
                          : undefined
                    }
                  >
                    {formatSignedPercentage(row.dayChangePercent)}
                  </strong>
                </div>
                <div className="align-right">
                  <strong>{formatCurrency(row.usdValue)}</strong>
                </div>
                <div className="align-right allocation-cell">
                  <strong>{formatPercentage(row.allocation * 100)}</strong>
                  <span className="allocation-bar">
                    <span style={{ width: `${Math.max(row.allocation * 100, 4)}%` }} />
                  </span>
                </div>
                <div className="align-right">
                  <button className="table-action" type="button">
                    Trade
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
