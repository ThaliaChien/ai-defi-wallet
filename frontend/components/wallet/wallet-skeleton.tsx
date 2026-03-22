import type { WalletTab } from "@/types/wallet";

type WalletSkeletonProps = {
  activeTab: WalletTab;
};

export function WalletSkeleton({ activeTab }: WalletSkeletonProps) {
  return (
    <>
      <section className="wallet-main-grid">
        <div className="wallet-main-grid__primary">
          <div className="wallet-skeleton-panel panel-shell" data-tab={activeTab}>
            <div className="wallet-skeleton-line title" />
            <div className="wallet-skeleton-line body" />
            <div className="wallet-skeleton-line body" />
            <div className="wallet-skeleton-line body short" />
          </div>
        </div>
        <div className="wallet-main-grid__secondary">
          <div className="wallet-skeleton-panel panel-shell">
            <div className="wallet-skeleton-line title" />
            <div className="wallet-skeleton-line body" />
            <div className="wallet-skeleton-line body short" />
          </div>
          <div className="wallet-skeleton-panel panel-shell">
            <div className="wallet-skeleton-line title" />
            <div className="wallet-skeleton-line body" />
            <div className="wallet-skeleton-line body" />
          </div>
          <div className="wallet-skeleton-panel panel-shell">
            <div className="wallet-skeleton-line title" />
            <div className="wallet-skeleton-line body" />
            <div className="wallet-skeleton-line body short" />
          </div>
        </div>
      </section>

      <section className="wallet-bottom-grid">
        <div className="wallet-skeleton-panel panel-shell">
          <div className="wallet-skeleton-line title" />
          <div className="wallet-skeleton-line body" />
          <div className="wallet-skeleton-line body" />
        </div>
        <div className="wallet-skeleton-panel panel-shell">
          <div className="wallet-skeleton-line title" />
          <div className="wallet-skeleton-line body" />
          <div className="wallet-skeleton-line body short" />
        </div>
      </section>
    </>
  );
}
