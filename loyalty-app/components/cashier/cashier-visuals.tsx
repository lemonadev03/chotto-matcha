import Image from "next/image";
import { clsx } from "clsx";
import { initials } from "@/lib/formatters";

export function CustomerAvatar({
  name,
  className
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-grid shrink-0 place-items-center rounded-pill bg-sage-wash text-sm font-semibold text-matcha-deep",
        className
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export function TeaStillLife({ className }: { className?: string }) {
  return (
    <Image
      src="/cashier/matcha-still-life.png"
      alt=""
      width={1536}
      height={1024}
      className={clsx("block object-cover", className)}
      aria-hidden="true"
    />
  );
}

export function StartShiftStillLife({ className }: { className?: string }) {
  return (
    <Image
      src="/cashier/matcha-start-portrait.png"
      alt=""
      width={1086}
      height={1448}
      className={clsx("block object-cover", className)}
      aria-hidden="true"
    />
  );
}

export function StorefrontSketch({ className }: { className?: string }) {
  return (
    <Image
      src="/cashier/matcha-storefront.png"
      alt=""
      width={1718}
      height={915}
      className={clsx("block object-cover", className)}
      aria-hidden="true"
    />
  );
}

export function ScanFrame({ className }: { className?: string }) {
  return (
    <div className={clsx("cashier-scan-frame", className)} aria-hidden="true">
      <span className="corner top-left" />
      <span className="corner top-right" />
      <span className="corner bottom-left" />
      <span className="corner bottom-right" />
      <span className="cashier-scan-mark" />
    </div>
  );
}

const rewardImages: Record<string, string> = {
  "reward-whisk": "/cashier/reward-whisk.png",
  "reward-tote": "/cashier/reward-tote.png",
  "reward-tin": "/cashier/reward-tin.png",
  "reward-latte": "/cashier/reward-latte.png",
  "reward-cookie": "/cashier/reward-cookie.png"
};

export function RewardThumbnail({
  rewardId,
  name,
  className
}: {
  rewardId: string;
  name: string;
  className?: string;
}) {
  return (
    <Image
      src={rewardImages[rewardId] ?? "/cashier/matcha-still-life.png"}
      alt=""
      width={336}
      height={466}
      className={clsx("block object-cover", className)}
      aria-hidden="true"
      title={name}
    />
  );
}
