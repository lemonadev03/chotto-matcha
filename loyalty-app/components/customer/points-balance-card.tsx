import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { Tier } from "@/lib/loyalty";
import { formatPoints } from "@/lib/formatters";

export function PointsBalanceCard({
  points,
  tier,
  nextTier,
  pointsToNext,
  progress,
  greeting,
  actions,
  className
}: {
  points: number;
  tier: Tier;
  nextTier?: Tier | null;
  pointsToNext?: number;
  progress?: number;
  greeting?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const TierIcon = tier.icon;
  const showProgress =
    Boolean(nextTier) && typeof progress === "number" && typeof pointsToNext === "number";

  return (
    <section
      className={clsx(
        "matcha-panel relative overflow-hidden rounded-[28px] px-6 py-6 text-cream shadow-[var(--shadow-panel)]",
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            {greeting ? <div className="text-sm font-medium text-cream/80">{greeting}</div> : null}
            <p className="mt-1 text-xs uppercase tracking-eyebrow text-cream/60">
              Available points
            </p>
          </div>
          <div className="inline-flex max-w-[9.75rem] items-center gap-1.5 rounded-pill border border-cream/20 bg-cream/10 px-3 py-1.5 text-xs font-medium leading-4 text-cream/90">
            <TierIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span className="truncate">{tier.name}</span>
          </div>
        </div>

        <div className="mt-7 flex items-end justify-between gap-4">
          <p className="counter font-display text-[58px] font-medium leading-[0.86] tracking-display sm:text-[64px]">
            {formatPoints(points)}
          </p>
          <p className="max-w-[8.75rem] pb-1 text-right text-xs leading-4 text-cream/60">
            {tier.vibe}
          </p>
        </div>

        {showProgress ? (
          <div className="mt-6 border-t border-cream/10 pt-4">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-medium text-cream/80">
                {formatPoints(pointsToNext!)} points to {nextTier!.name}
              </span>
              <span className="counter text-cream/60">
                {formatPoints(points)} / {formatPoints(nextTier!.min)}
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-pill bg-cream/20">
              <div
                className="h-full rounded-pill bg-cream"
                style={{ width: `${Math.round(progress! * 100)}%` }}
              />
            </div>
          </div>
        ) : null}

        {actions ? <div className="mt-6">{actions}</div> : null}
      </div>
    </section>
  );
}
