"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { customers, user, userRoles } from "@/db/schema";
import { auth } from "@/lib/auth/server";

export type SignupState = {
  error?: string;
};

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function signUpCustomer(_: SignupState, formData: FormData): Promise<SignupState> {
  const name = text(formData, "name");
  const email = text(formData, "email").toLowerCase();
  const phone = text(formData, "phone");
  const password = text(formData, "password");

  try {
    if (!name || !email || !phone || !password) throw new Error("All fields are required");
    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    const existingCustomer = await db.query.customers.findFirst({
      where: eq(customers.email, email)
    });
    if (existingCustomer) throw new Error("A customer with this email already exists");

    await auth.api.signUpEmail({ body: { email, password, name } });
    const authUser = await db.query.user.findFirst({ where: eq(user.email, email) });
    if (!authUser) throw new Error("Auth user was not created");

    await db.transaction(async (tx) => {
      await tx.insert(customers).values({
        id: randomUUID(),
        authUserId: authUser.id,
        email,
        name,
        phone,
        active: true
      });
      await tx.insert(userRoles).values({ authUserId: authUser.id, role: "customer" }).onConflictDoNothing();
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not create customer account" };
  }

  redirect("/customer/login?created=1");
}
