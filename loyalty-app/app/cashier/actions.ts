"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { branches, staffRoleDetails } from "@/db/schema";
import { hashDemoPin } from "@/lib/auth/pin";
import { clearCashierShiftCookie, setCashierShiftCookie } from "@/lib/auth/shift";
import { requireCashierSession, requireCashierShiftSession } from "@/lib/auth/session";
import { awardPoints, redeemReward } from "@/lib/data/transactions";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nonEmpty(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) throw new Error(`${key} is required`);
  return value;
}

export async function startCashierShift(formData: FormData) {
  const { profile, roleDetail } = await requireCashierSession();
  const pin = nonEmpty(formData, "pin");
  if (!roleDetail.branchId) redirect("/cashier/access-denied");

  const detail = await db.query.staffRoleDetails.findFirst({
    where: and(
      eq(staffRoleDetails.staffProfileId, profile.id),
      eq(staffRoleDetails.role, "cashier"),
      eq(staffRoleDetails.branchId, roleDetail.branchId)
    )
  });
  const branch = await db.query.branches.findFirst({
    where: and(eq(branches.id, roleDetail.branchId), eq(branches.active, true))
  });
  if (!detail?.pinHash || detail.pinHash !== hashDemoPin(pin) || !branch) {
    redirect("/cashier?pin=invalid");
  }

  await setCashierShiftCookie({
    staffProfileId: profile.id,
    branchId: roleDetail.branchId,
    issuedAt: Date.now()
  });
  revalidatePath("/cashier");
  redirect("/cashier/identify");
}

export async function endCashierShift() {
  await clearCashierShiftCookie();
  redirect("/cashier");
}

export async function awardCustomerPoints(formData: FormData) {
  const { profile, branch } = await requireCashierShiftSession();
  const customerId = nonEmpty(formData, "customerId");
  const billTotalCents = Math.round(Number(nonEmpty(formData, "billTotal")) * 100);
  await awardPoints({ customerId, staffProfileId: profile.id, branchId: branch.id, billTotalCents });
  revalidatePath(`/cashier/customer/${customerId}`);
  redirect(`/cashier/customer/${customerId}`);
}

export async function redeemCustomerReward(formData: FormData) {
  const { profile, branch } = await requireCashierShiftSession();
  const customerId = nonEmpty(formData, "customerId");
  await redeemReward({
    customerId,
    staffProfileId: profile.id,
    branchId: branch.id,
    rewardId: nonEmpty(formData, "rewardId")
  });
  revalidatePath(`/cashier/customer/${customerId}`);
  redirect(`/cashier/customer/${customerId}`);
}
