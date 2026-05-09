import { Leaf } from "lucide-react";
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
    nextTier && typeof progress === "number" && typeof pointsToNext === "number";

  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-xl bg-matcha-deep p-7 text-cream shadow-md",
        className
      )}
    >
      <Leaf
        className="pointer-events-none absolute -right-10 -top-6 h-56 w-56 text-cream/[0.07]"
        strokeWidth={1}
        fill="currentColor"
        aria-hidden="true"
      />
      <div className="relative">
        {greeting ? <div className="mb-4 text-sm text-cream/80">{greeting}</div> : null}
        <p className="font-display text-[64px] font-medium leading-none tracking-display">
          {formatPoints(points)}
        </p>
        <p className="mt-2 text-sm text-cream/70">available points</p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-pill bg-cream/12 px-3 py-1 text-xs font-medium text-cream/90">
          <TierIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          {tier.name} · {tier.vibe}
        </div>

        {showProgress ? (
          <div className="mt-5 max-w-[18rem]">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-cream/70">
                {formatPoints(pointsToNext!)} points to {nextTier!.name}
              </span>
              <span className="counter font-medium text-cream/90">
                {formatPoints(points)} / {formatPoints(nextTier!.min)}
              </span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-pill bg-cream/15">
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
