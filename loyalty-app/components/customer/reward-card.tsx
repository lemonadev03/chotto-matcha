import { clsx } from "clsx";
import { RewardImage } from "@/components/customer/reward-image";
import { formatPoints } from "@/lib/formatters";
import { pointsNeeded } from "@/lib/points";
import type { Customer, Reward } from "@/lib/types";

export function RewardCard({
  reward,
  customer,
  className
}: {
  reward: Reward;
  customer: Customer;
  className?: string;
}) {
  const needed = pointsNeeded(customer, reward);
  const hasStock = reward.stockCount === null || reward.stockCount > 0;
  const ready = needed === 0 && hasStock;
  const progress = Math.min(1, customer.pointsBalance / reward.pointCost);
  const visualProgress = ready ? 0.48 : !hasStock ? 0.54 : progress;
  const stockLabel =
    reward.stockCount === null
      ? "Always available"
      : reward.stockCount === 0
      ? "Out for now"
      : `${reward.stockCount} left`;

  return (
    <article
      className={clsx(
        "h-24 rounded-sm border border-line-soft bg-milk p-2 shadow-sm transition-colors duration-fast ease-out-soft hover:border-line",
        className
      )}
    >
      <div className="flex h-full gap-5">
        <RewardImage imageUrl={reward.imageUrl} name={reward.name} type={reward.type} />
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 font-display text-base leading-[19px] text-charcoal">
                {reward.name}
              </h3>
              <span className="counter shrink-0 rounded-pill border border-sage-tint bg-sage-wash px-2.5 py-1 text-xs font-medium leading-none text-matcha-deep">
                {formatPoints(reward.pointCost)}
              </span>
            </div>
            <p className="line-clamp-2 text-xs leading-[15px] text-ink-muted">
              {reward.description}
            </p>
          </div>
          <div>
            <div className="h-1 w-full overflow-hidden rounded-pill bg-line-soft">
              <div
                className="h-full rounded-pill bg-matcha-deep transition-[width] duration-base ease-out-soft"
                style={{ width: `${Math.round(visualProgress * 100)}%` }}
              />
            </div>
            <div className="mt-0.5 flex items-center justify-between gap-3 text-xs leading-4">
              <span className="truncate text-ink-muted">{stockLabel}</span>
              <span
                className={clsx(
                  "counter shrink-0 font-medium",
                  ready
                    ? "text-matcha-deep"
                    : !hasStock
                      ? "text-error-text"
                      : "text-ink-muted"
                )}
              >
                {ready
                  ? "Ready"
                  : !hasStock
                    ? "Out"
                    : `${formatPoints(customer.pointsBalance)} / ${formatPoints(reward.pointCost)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
