import { clsx } from "clsx";
import type { Tier } from "@/lib/loyalty";

export function TierBadge({
  tier,
  size = "md",
  className
}: {
  tier: Tier;
  size?: "sm" | "md";
  className?: string;
}) {
  const Icon = tier.icon;
  const isSm = size === "sm";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-pill bg-sage-wash text-matcha-deep",
        isSm ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        className
      )}
    >
      <Icon
        className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"}
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span className="font-medium tracking-tight">{tier.name}</span>
    </span>
  );
}
