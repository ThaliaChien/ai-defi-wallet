export function WalletLoading() {
  return (
    <section className="loading-stack" aria-label="Loading portfolio overview">
      <div className="overview-section skeleton-overview">
        <div className="panel skeleton-card skeleton-card-large" />
        <div className="panel skeleton-card" />
        <div className="panel skeleton-card" />
        <div className="panel skeleton-card" />
      </div>

      <div className="wallet-content-grid">
        <div className="panel skeleton-panel skeleton-panel-large">
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-body" />
          <div className="skeleton-line skeleton-line-body" />
          <div className="skeleton-line skeleton-line-body short" />
        </div>

        <div className="wallet-secondary-column">
          <div className="panel skeleton-panel">
            <div className="skeleton-line skeleton-line-title" />
            <div className="skeleton-line skeleton-line-body" />
            <div className="skeleton-line skeleton-line-body short" />
          </div>
          <div className="panel skeleton-panel">
            <div className="skeleton-line skeleton-line-title" />
            <div className="skeleton-line skeleton-line-body" />
            <div className="skeleton-line skeleton-line-body" />
          </div>
        </div>
      </div>
    </section>
  );
}
