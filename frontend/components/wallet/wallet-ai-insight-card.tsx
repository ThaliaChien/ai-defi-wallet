type WalletAiInsightCardProps = {
  summary: string | null;
  dominantAsset: string | null;
  protocolCount: number;
};

export function WalletAiInsightCard({
  summary,
  dominantAsset,
  protocolCount,
}: WalletAiInsightCardProps) {
  return (
    <section className="wallet-panel wallet-panel--inverse panel-shell">
      <div className="wallet-panel__header">
        <div>
          <p className="section-kicker">AI Insight</p>
          <h2 className="section-title">Portfolio Signal</h2>
        </div>
        <span className="status-chip muted inverse">Derived</span>
      </div>

      <p className="ai-insight-copy">
        {summary ?? "AI insight will appear once portfolio data is available."}
      </p>

      <div className="ai-insight-grid">
        <div>
          <span className="info-label">Dominant Asset</span>
          <strong>{dominantAsset ?? "--"}</strong>
        </div>
        <div>
          <span className="info-label">Protocol Footprint</span>
          <strong>{protocolCount}</strong>
        </div>
      </div>
    </section>
  );
}
