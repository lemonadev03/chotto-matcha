import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Gift, QrCode } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { PointsBalanceCard } from "@/components/customer/points-balance-card";
import { RewardCard } from "@/components/customer/reward-card";
import { requireCustomerSession } from "@/lib/auth/session";
import { listBranches } from "@/lib/data/branches";
import { getCustomerRecentTransactions } from "@/lib/data/customers";
import { listActiveRewards } from "@/lib/data/rewards";
import { formatDate, formatPoints } from "@/lib/formatters";
import { getNextTier, getTier, pointsToNextTier, tierProgress } from "@/lib/loyalty";

export default async function CustomerHome() {
  const { customer } = await requireCustomerSession();
  const [recent, rewards, branches] = await Promise.all([
    getCustomerRecentTransactions(customer.id, 3),
    listActiveRewards(),
    listBranches()
  ]);
  const branchById = new Map(branches.map((branch) => [branch.id, branch]));
  const rewardById = new Map(rewards.map((reward) => [reward.id, reward]));
  const firstName = customer.name.split(" ")[0];
  const tier = getTier(customer.pointsBalance);
  const nextTier = getNextTier(customer.pointsBalance);
  const pointsToNext = pointsToNextTier(customer.pointsBalance);
  const progress = tierProgress(customer.pointsBalance);
  const featured = rewards.slice(0, 2);

  return (
    <CustomerShell>
      <PointsBalanceCard
        points={customer.pointsBalance}
        tier={tier}
        nextTier={nextTier}
        pointsToNext={pointsToNext}
        progress={progress}
        greeting={<>Hi, {firstName}</>}
        actions={
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/customer/qr"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill bg-milk px-4 text-sm font-semibold text-matcha-deep shadow-sm transition-colors duration-fast ease-out-soft hover:bg-sage-wash"
            >
              <QrCode className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Show QR
            </Link>
            <Link
              href="/customer/rewards"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill border border-cream/25 px-4 text-sm font-semibold text-cream transition-colors duration-fast ease-out-soft hover:bg-cream/10"
            >
              <Gift className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Rewards
            </Link>
          </div>
        }
      />

      <section className="mt-7">
        <header className="mb-3 flex items-end justify-between">
          <div>
            <p className="eyebrow text-matcha-deep">Today&apos;s moment</p>
            <h2 className="mt-2 font-display text-[24px] font-medium leading-[30px] text-charcoal">
              Ready to redeem
            </h2>
          </div>
          <Link
            href="/customer/rewards"
            className="text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
          >
            See all
          </Link>
        </header>
        <div className="grid gap-3">
          {featured.map((reward) => (
            <RewardCard key={reward.id} reward={reward} customer={customer} />
          ))}
        </div>
      </section>

      <section className="mt-32">
        <header className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-[24px] font-medium leading-[30px] text-charcoal">
            Recent activity
          </h2>
          <Link
            href="/customer/activity"
            className="text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
          >
            View all
          </Link>
        </header>
        <ul className="grid gap-2">
          {recent.map((transaction) => {
            const earned = transaction.pointsDelta > 0;
            const label =
              transaction.type === "redeem"
                ? rewardById.get(transaction.rewardId ?? "")?.name ?? "Reward redeemed"
                : branchById.get(transaction.branchId ?? "")?.name ?? "Manual moment";
            return (
              <li
                key={transaction.id}
                className="flex items-center justify-between gap-3 rounded-sm border border-line-soft bg-milk px-4 py-3 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-charcoal">{label}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <span
                  className={
                    earned
                      ? "counter inline-flex shrink-0 items-center gap-1 text-sm font-medium text-matcha-deep"
                      : "counter inline-flex shrink-0 items-center gap-1 text-sm font-medium text-error-text"
                  }
                >
                  {earned ? (
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  )}
                  {earned ? "+" : ""}
                  {formatPoints(transaction.pointsDelta)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </CustomerShell>
  );
}
