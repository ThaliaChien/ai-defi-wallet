type WalletStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function WalletState({
  title,
  description,
  actionLabel,
  onAction,
}: WalletStateProps) {
  return (
    <section className="panel state-panel">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {actionLabel && onAction ? (
        <button className="secondary-button" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
