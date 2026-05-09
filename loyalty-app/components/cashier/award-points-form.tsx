"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Leaf } from "lucide-react";
import { awardCustomerPoints } from "@/app/cashier/actions";
import { Button } from "@/components/shared/button";
import { calculateEarnedPoints } from "@/lib/points";
import { formatPeso, formatPoints } from "@/lib/formatters";

type AwardPointsFormProps = {
  customerId: string;
  earnRate: number;
  initialBillTotal?: number;
  showBillError?: boolean;
};

export function AwardPointsForm({
  customerId,
  earnRate,
  initialBillTotal = 420,
  showBillError = false
}: AwardPointsFormProps) {
  const [billTotal, setBillTotal] = useState(initialBillTotal.toString());
  const numericBillTotal = Number(billTotal);
  const safeBillTotal = Number.isFinite(numericBillTotal) && numericBillTotal > 0 ? numericBillTotal : 0;
  const points = useMemo(() => calculateEarnedPoints(safeBillTotal, earnRate), [earnRate, safeBillTotal]);

  return (
    <>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-line-soft bg-stone/40 p-5">
          <p className="eyebrow text-ink-muted">Bill total</p>
          <p className="mt-3 font-display text-[40px] font-medium leading-none text-charcoal">
            {formatPeso(safeBillTotal)}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-md bg-matcha-deep p-5 text-cream">
          <Leaf
            className="pointer-events-none absolute -right-6 -top-3 h-32 w-32 text-cream/[0.08]"
            strokeWidth={1}
            fill="currentColor"
            aria-hidden="true"
          />
          <p className="eyebrow relative text-cream/70">Points to award</p>
          <p className="counter relative mt-3 font-display text-[40px] font-medium leading-none">
            +{formatPoints(points)}
          </p>
        </div>
      </div>

      <form action={awardCustomerPoints} className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <input type="hidden" name="customerId" value={customerId} />
        <label className="grid gap-2 text-sm font-medium text-charcoal">
          Bill total
          <input
            name="billTotal"
            type="number"
            min="1"
            step="0.01"
            value={billTotal}
            onChange={(event) => setBillTotal(event.target.value)}
            className="h-12 rounded-md border border-line bg-cream px-4 focus:border-matcha-deep focus:outline-none focus:shadow-focus"
          />
        </label>
        <Button type="submit" icon={CheckCircle2} disabled={safeBillTotal <= 0}>
          Confirm award
        </Button>
        <Button href={`/cashier/customer/${customerId}`} variant="secondary" icon={ArrowLeft}>
          Back
        </Button>
        {showBillError ? (
          <p className="text-sm text-error-text sm:col-span-3">Enter a bill total greater than zero.</p>
        ) : null}
      </form>
    </>
  );
}
