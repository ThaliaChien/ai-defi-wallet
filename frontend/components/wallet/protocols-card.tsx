import type { ProtocolOverviewItem } from "@/types/api";

type ProtocolsCardProps = {
  protocols: ProtocolOverviewItem[];
};

export function ProtocolsCard({ protocols }: ProtocolsCardProps) {
  return (
    <section className="panel section-panel">
      <div className="section-heading">
        <div>
          <p className="panel-label">Protocol exposure</p>
          <h2>DeFi positions</h2>
        </div>
        <p className="section-caption">Context for deployed capital and recent interaction patterns.</p>
      </div>

      {protocols.length === 0 ? (
        <p className="empty-copy">No protocol exposure is recorded for this portfolio.</p>
      ) : (
        <div className="protocol-stack">
          {protocols.map((protocol) => (
            <article className="protocol-card" key={`${protocol.name}-${protocol.category}`}>
              <div className="protocol-head">
                <div>
                  <strong>{protocol.name}</strong>
                  <p>{protocol.category}</p>
                </div>
                <span className="network-pill neutral">{protocol.category}</span>
              </div>
              <p className="protocol-summary">{protocol.position_summary}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
