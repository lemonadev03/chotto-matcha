import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/server";
import { db } from "@/db/client";
import { branches, customers, staffProfiles, staffRoleDetails, userRoles } from "@/db/schema";
import { getCashierShiftCookie } from "@/lib/auth/shift";
import type { Role } from "@/lib/types";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function requireRoleSession(role: Role, loginPath: string, deniedPath: string) {
  const session = await getSession();
  if (!session) redirect(loginPath);

  const userRole = await db.query.userRoles.findFirst({
    where: and(eq(userRoles.authUserId, session.user.id), eq(userRoles.role, role))
  });
  if (!userRole) redirect(deniedPath);

  return session;
}

export async function requireManagerSession() {
  const session = await requireRoleSession("manager", "/manager/login", "/manager/access-denied");

  const profile = await db.query.staffProfiles.findFirst({
    where: and(eq(staffProfiles.authUserId, session.user.id), eq(staffProfiles.active, true))
  });
  if (!profile) redirect("/manager/access-denied");

  const roleDetail = await db.query.staffRoleDetails.findFirst({
    where: and(eq(staffRoleDetails.staffProfileId, profile.id), eq(staffRoleDetails.role, "manager"))
  });
  if (!roleDetail) redirect("/manager/access-denied");

  return { user: session.user, profile, roleDetail };
}

export async function requireCustomerSession() {
  const session = await requireRoleSession("customer", "/customer/login", "/customer/access-denied");

  const customer = await db.query.customers.findFirst({
    where: and(eq(customers.authUserId, session.user.id), eq(customers.active, true))
  });
  if (!customer) redirect("/customer/access-denied");

  return { user: session.user, customer };
}

export async function requireCashierSession() {
  const session = await requireRoleSession("cashier", "/cashier/login", "/cashier/access-denied");

  const profile = await db.query.staffProfiles.findFirst({
    where: and(eq(staffProfiles.authUserId, session.user.id), eq(staffProfiles.active, true))
  });
  if (!profile) redirect("/cashier/access-denied");

  const roleDetail = await db.query.staffRoleDetails.findFirst({
    where: and(eq(staffRoleDetails.staffProfileId, profile.id), eq(staffRoleDetails.role, "cashier"))
  });
  if (!roleDetail?.branchId) redirect("/cashier/access-denied");

  return { user: session.user, profile, roleDetail };
}

export async function requireCashierShiftSession() {
  const shift = await getCashierShiftCookie();
  if (!shift) redirect("/cashier");

  const profile = await db.query.staffProfiles.findFirst({
    where: and(eq(staffProfiles.id, shift.staffProfileId), eq(staffProfiles.active, true))
  });
  if (!profile) redirect("/cashier/access-denied");

  const roleDetail = await db.query.staffRoleDetails.findFirst({
    where: and(
      eq(staffRoleDetails.staffProfileId, profile.id),
      eq(staffRoleDetails.role, "cashier"),
      eq(staffRoleDetails.branchId, shift.branchId)
    )
  });
  if (!roleDetail) {
    redirect("/cashier/access-denied");
  }

  const branch = await db.query.branches.findFirst({
    where: and(eq(branches.id, shift.branchId), eq(branches.active, true))
  });
  if (!branch) redirect("/cashier/access-denied");

  return { user: null, profile, roleDetail, shift, branch };
}
