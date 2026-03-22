type WalletStateShellProps = {
  title: string;
  description: string;
  variant: "idle" | "error" | "empty";
  actionLabel?: string;
  onAction?: () => void;
};

export function WalletStateShell({
  title,
  description,
  variant,
  actionLabel,
  onAction,
}: WalletStateShellProps) {
  return (
    <div className={`wallet-state-shell wallet-state-shell--${variant}`}>
      <div>
        <span className="wallet-state-shell__tag">
          {variant === "error" ? "System" : variant === "empty" ? "Empty State" : "Connect"}
        </span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {actionLabel && onAction ? (
        <button className="secondary-button" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
