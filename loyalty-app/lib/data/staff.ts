import "server-only";

import { and, asc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db/client";
import { branches, staffProfiles, staffRoleDetails, userRoles } from "@/db/schema";

export async function listStaffProfiles() {
  return db.query.staffProfiles.findMany({ orderBy: [asc(staffProfiles.name)] });
}

export async function getStaffProfileById(id: string) {
  return db.query.staffProfiles.findFirst({ where: eq(staffProfiles.id, id) });
}

export async function getStaffProfileByAuthUserId(authUserId: string) {
  return db.query.staffProfiles.findFirst({ where: eq(staffProfiles.authUserId, authUserId) });
}

export async function listStaffRoleDetails() {
  return db.select().from(staffRoleDetails);
}

export async function listCashiersForBranch(branchId: string) {
  return db
    .select({ profile: staffProfiles, detail: staffRoleDetails })
    .from(staffProfiles)
    .innerJoin(staffRoleDetails, eq(staffProfiles.id, staffRoleDetails.staffProfileId))
    .where(
      and(
        eq(staffProfiles.active, true),
        eq(staffRoleDetails.role, "cashier"),
        eq(staffRoleDetails.branchId, branchId)
      )
    )
    .orderBy(asc(staffProfiles.name));
}

export async function listActiveCashiersWithBranches() {
  return db
    .select({
      profile: staffProfiles,
      detail: staffRoleDetails,
      branch: branches
    })
    .from(staffProfiles)
    .innerJoin(staffRoleDetails, eq(staffProfiles.id, staffRoleDetails.staffProfileId))
    .innerJoin(userRoles, eq(staffProfiles.authUserId, userRoles.authUserId))
    .innerJoin(branches, eq(staffRoleDetails.branchId, branches.id))
    .where(
      and(
        eq(staffProfiles.active, true),
        eq(userRoles.role, "cashier"),
        eq(staffRoleDetails.role, "cashier"),
        eq(branches.active, true),
        isNotNull(staffRoleDetails.pinHash)
      )
    )
    .orderBy(asc(branches.name), asc(staffProfiles.name));
}
