import type { ProtocolOverviewItem } from "@/types/api";

type ProtocolsCardProps = {
  protocols: ProtocolOverviewItem[];
};

export function ProtocolsCard({ protocols }: ProtocolsCardProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="panel-label">Protocols</p>
          <h2>DeFi activity</h2>
        </div>
      </div>

      {protocols.length === 0 ? (
        <p className="empty-copy">No protocol positions in this wallet yet.</p>
      ) : (
        <div className="protocol-list">
          {protocols.map((protocol) => (
            <article className="list-row" key={`${protocol.name}-${protocol.category}`}>
              <div>
                <strong>{protocol.name}</strong>
                <p>{protocol.category}</p>
              </div>
              <p className="protocol-summary">{protocol.position_summary}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
