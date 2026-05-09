import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Pill } from "@/components/shared/pill";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { redeemCustomerReward } from "@/app/cashier/actions";
import { requireCashierShiftSession } from "@/lib/auth/session";
import { getCustomerById } from "@/lib/data/customers";
import { listActiveRewards } from "@/lib/data/rewards";
import { canRedeem } from "@/lib/points";
import { formatPoints } from "@/lib/formatters";

export default async function CashierRedeemPage({
  searchParams
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { profile, branch } = await requireCashierShiftSession();
  const { customerId } = await searchParams;
  if (!customerId) notFound();
  const [customer, rewards] = await Promise.all([getCustomerById(customerId), listActiveRewards()]);
  if (!customer?.active) notFound();

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`}>
      <section className="rounded-lg border border-line-soft bg-cream p-7">
        <Eyebrow className="text-matcha-deep">Redeem reward</Eyebrow>
        <h1 className="mt-3 font-display text-[40px] font-medium leading-[44px] text-charcoal">
          {customer.name}
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          {formatPoints(customer.pointsBalance)} points available.
        </p>

        <form action={redeemCustomerReward} className="mt-6 grid gap-3">
          <input type="hidden" name="customerId" value={customer.id} />
          {rewards.map((reward) => {
            const available = canRedeem(customer, reward);
            return (
              <label
                key={reward.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line-soft bg-stone/30 p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="rewardId"
                    value={reward.id}
                    className="h-4 w-4 accent-[var(--matcha-deep)]"
                    disabled={!available}
                    defaultChecked={available && reward.id === rewards[0]?.id}
                  />
                  <div>
                    <p className="font-medium text-charcoal">{reward.name}</p>
                    <p className="counter mt-0.5 text-xs text-ink-muted">
                      {formatPoints(reward.pointCost)} points ·{" "}
                      {reward.stockCount === null ? "Always available" : `${reward.stockCount} left`}
                    </p>
                  </div>
                </div>
                <Pill tone={available ? "default" : "muted"}>
                  {available ? "Ready" : "Locked"}
                </Pill>
              </label>
            );
          })}

          <Button type="submit" icon={CheckCircle2} className="mt-3">
            Confirm reward
          </Button>
        </form>
      </section>
    </CashierShell>
  );
}
