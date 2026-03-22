import {
  formatCompactCurrency,
  formatCurrency,
  formatSignedPercentage,
} from "@/lib/format";
import type { WalletSummaryMetrics } from "@/types/wallet";

type WalletSummaryBarProps = {
  summary: WalletSummaryMetrics | null;
  state: "idle" | "loading" | "success" | "error" | "empty";
};

export function WalletSummaryBar({ summary, state }: WalletSummaryBarProps) {
  const metrics = [
    {
      label: "Total Balance",
      value: summary ? formatCurrency(summary.totalValue) : state === "empty" ? formatCurrency(0) : "--",
      meta: summary ? `${summary.assetCount} assets tracked` : "Portfolio snapshot unavailable",
      emphasis: true,
    },
    {
      label: "Available",
      value: summary ? formatCompactCurrency(summary.availableValue) : state === "empty" ? formatCurrency(0) : "--",
      meta: summary ? "Spendable wallet balance" : "Awaiting wallet data",
    },
    {
      label: "In Protocols",
      value: summary ? formatCompactCurrency(summary.deployedValue) : state === "empty" ? formatCurrency(0) : "--",
      meta: summary ? `${summary.protocolCount} active protocol lines` : "No deployed capital detected",
    },
    {
      label: "24h PnL",
      value: summary ? formatCurrency(summary.dayChangeValue) : state === "empty" ? formatCurrency(0) : "--",
      meta: summary ? formatSignedPercentage(summary.dayChangePercent) : "Derived from local pricing map",
      tone:
        summary && summary.dayChangeValue > 0
          ? "positive"
          : summary && summary.dayChangeValue < 0
            ? "negative"
            : "neutral",
    },
  ];

  return (
    <section className="wallet-summary-bar">
      {metrics.map((metric) => (
        <article
          className={metric.emphasis ? "summary-card summary-card--primary panel-shell" : "summary-card panel-shell"}
          key={metric.label}
        >
          <span className="summary-card__label">{metric.label}</span>
          {state === "loading" ? (
            <>
              <span className="summary-card__skeleton title" />
              <span className="summary-card__skeleton body" />
            </>
          ) : (
            <>
              <strong
                className={
                  metric.tone === "positive"
                    ? "summary-card__value is-positive"
                    : metric.tone === "negative"
                      ? "summary-card__value is-negative"
                      : "summary-card__value"
                }
              >
                {metric.value}
              </strong>
              <p className="summary-card__meta">{metric.meta}</p>
            </>
          )}
        </article>
      ))}
    </section>
  );
}
