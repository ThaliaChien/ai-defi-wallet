import { formatCompactCurrency, formatPercentage } from "@/lib/format";
import type { WalletAllocationSlice } from "@/types/wallet";

type WalletAllocationCardProps = {
  slices: WalletAllocationSlice[];
};

export function WalletAllocationCard({ slices }: WalletAllocationCardProps) {
  const visibleSlices = slices.slice(0, 5);

  return (
    <section className="wallet-panel panel-shell">
      <div className="wallet-panel__header">
        <div>
          <p className="section-kicker">Portfolio Distribution</p>
          <h2 className="section-title">Allocation</h2>
        </div>
      </div>

      {visibleSlices.length === 0 ? (
        <p className="panel-empty-copy">Distribution data will appear after assets are loaded.</p>
      ) : (
        <div className="allocation-list">
          {visibleSlices.map((slice) => (
            <article className="allocation-list__row" key={slice.label}>
              <div>
                <strong>{slice.label}</strong>
                <p>{formatCompactCurrency(slice.value)}</p>
              </div>
              <div className="allocation-list__meta">
                <strong>{formatPercentage(slice.percentage)}</strong>
                <span className="allocation-bar">
                  <span style={{ width: `${Math.max(slice.percentage, 6)}%` }} />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
