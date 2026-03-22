type AiSummaryCardProps = {
  summary: string;
};

export function AiSummaryCard({ summary }: AiSummaryCardProps) {
  return (
    <section className="panel ai-summary-card">
      <div className="panel-header">
        <div>
          <p className="panel-label">AI Summary</p>
          <h2>Portfolio narrative</h2>
        </div>
      </div>

      <p className="ai-summary-text">{summary}</p>
    </section>
  );
}
