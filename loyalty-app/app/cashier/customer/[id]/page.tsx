import { ArrowLeft, Gift, Leaf, PlusCircle } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { TierBadge } from "@/components/customer/tier-badge";
import { requireCashierShiftSession } from "@/lib/auth/session";
import { getCustomerById } from "@/lib/data/customers";
import { formatPoints } from "@/lib/formatters";
import { getTier } from "@/lib/loyalty";
import { notFound } from "next/navigation";

export default async function CashierCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { profile, branch } = await requireCashierShiftSession();
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer?.active) notFound();
  const tier = getTier(customer.pointsBalance);

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`}>
      <div className="mb-4">
        <Button href="/cashier/identify" variant="tertiary" icon={ArrowLeft}>
          Back to lookup
        </Button>
      </div>
      <section className="rounded-lg border border-line-soft bg-cream p-7">
        <Eyebrow className="text-matcha-deep">Member found</Eyebrow>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-[40px] font-medium leading-[44px] text-charcoal sm:text-[44px] sm:leading-[48px]">
            {customer.name}
          </h1>
          <TierBadge tier={tier} />
        </div>
        <p className="mt-2 text-sm leading-6 text-ink-muted">{customer.phone}</p>

        <div className="relative mt-7 overflow-hidden rounded-lg bg-matcha-deep p-7 text-cream shadow-md">
          <Leaf
            className="pointer-events-none absolute -right-10 -top-6 h-56 w-56 text-cream/[0.07]"
            strokeWidth={1}
            fill="currentColor"
            aria-hidden="true"
          />
          <p className="eyebrow relative text-cream/70">Current balance</p>
          <p className="counter relative mt-3 font-display text-[64px] font-medium leading-none">
            {formatPoints(customer.pointsBalance)}
          </p>
          <p className="relative mt-2 text-sm text-cream/75">available points</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button href={`/cashier/award?customerId=${customer.id}`} icon={PlusCircle}>
            Award points
          </Button>
          <Button href={`/cashier/redeem?customerId=${customer.id}`} variant="secondary" icon={Gift}>
            Redeem reward
          </Button>
        </div>
      </section>
    </CashierShell>
  );
}
