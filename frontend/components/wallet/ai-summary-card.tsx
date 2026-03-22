type AiSummaryCardProps = {
  summary: string;
};

export function AiSummaryCard({ summary }: AiSummaryCardProps) {
  return (
    <section className="panel ai-summary-card section-panel">
      <div className="section-heading section-heading-compact">
        <div>
          <p className="panel-label">AI insights</p>
          <h2>Portfolio narrative</h2>
        </div>
        <span className="insight-pill">Model summary</span>
      </div>

      <p className="ai-summary-text">{summary}</p>

      <div className="insight-grid">
        <div className="insight-cell">
          <span className="mini-label">Focus</span>
          <strong>Allocation and protocol context</strong>
        </div>
        <div className="insight-cell">
          <span className="mini-label">Source</span>
          <strong>Wallet overview dataset</strong>
        </div>
      </div>
    </section>
  );
}
