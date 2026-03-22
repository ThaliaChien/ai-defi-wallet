import type { ProtocolOverviewItem } from "@/types/api";

type WalletProtocolsCardProps = {
  protocols: ProtocolOverviewItem[];
  mode?: "default" | "focus";
};

export function WalletProtocolsCard({ protocols, mode = "default" }: WalletProtocolsCardProps) {
  const visible = mode === "focus" ? protocols : protocols.slice(0, 4);

  return (
    <section className="wallet-panel panel-shell">
      <div className="wallet-panel__header">
        <div>
          <p className="section-kicker">Protocol Positions</p>
          <h2 className="section-title">
            {mode === "focus" ? "Earn Positions" : "Protocol Holdings"}
          </h2>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="panel-empty-copy">No protocol positions are available for this address.</p>
      ) : (
        <div className="protocol-position-list">
          {visible.map((protocol) => (
            <article className="protocol-position-row" key={`${protocol.name}-${protocol.category}`}>
              <div>
                <strong>{protocol.name}</strong>
                <p>{protocol.position_summary}</p>
              </div>
              <span className="status-chip muted">{protocol.category}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
