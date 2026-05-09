import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "./client";
import { user, staffProfiles } from "./schema";
import { auth } from "@/lib/auth/server";

const SEED_EMAIL = "lesmon@bscalelabs.com";
const SEED_PASSWORD = "demopass123";
const SEED_NAME = "Lesmon Saluta";

async function main() {
  let existing = await db.query.user.findFirst({ where: eq(user.email, SEED_EMAIL) });

  if (!existing) {
    console.log(`Creating manager user ${SEED_EMAIL}…`);
    await auth.api.signUpEmail({
      body: { email: SEED_EMAIL, password: SEED_PASSWORD, name: SEED_NAME }
    });
    existing = await db.query.user.findFirst({ where: eq(user.email, SEED_EMAIL) });
    if (!existing) throw new Error("User row was not created");
  } else {
    console.log(`Manager user already exists (${existing.id}); skipping signUp.`);
  }

  const profile = await db.query.staffProfiles.findFirst({
    where: eq(staffProfiles.userId, existing.id)
  });

  if (!profile) {
    console.log("Creating manager staff profile…");
    await db.insert(staffProfiles).values({
      id: randomUUID(),
      userId: existing.id,
      role: "manager",
      active: true
    });
  } else if (profile.role !== "manager" || !profile.active) {
    console.log("Updating manager staff profile to active manager…");
    await db
      .update(staffProfiles)
      .set({ role: "manager", active: true, updatedAt: new Date() })
      .where(eq(staffProfiles.userId, existing.id));
  } else {
    console.log("Manager staff profile already active; nothing to do.");
  }

  console.log(`Seed complete. user.id = ${existing.id}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
