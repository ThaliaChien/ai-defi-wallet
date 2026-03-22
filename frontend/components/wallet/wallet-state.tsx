type WalletStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "idle" | "error" | "empty";
};

export function WalletState({
  title,
  description,
  actionLabel,
  onAction,
  variant = "idle",
}: WalletStateProps) {
  return (
    <section className={`panel state-card state-${variant}`}>
      <div className="state-copy">
        <span className="state-tag">
          {variant === "error" ? "System status" : variant === "empty" ? "Portfolio state" : "Workspace"}
        </span>
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
