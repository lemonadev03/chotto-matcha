import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const CASHIER_SHIFT_COOKIE = "cashier_shift";

export type CashierShift = {
  staffProfileId: string;
  branchId: string;
  issuedAt: number;
};

function secret() {
  return process.env.BETTER_AUTH_SECRET ?? "chotto-demo-shift-secret";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function encodeShift(shift: CashierShift) {
  const payload = Buffer.from(JSON.stringify(shift), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeShift(value: string): CashierShift | null {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<CashierShift>;
    if (
      typeof parsed.staffProfileId !== "string" ||
      typeof parsed.branchId !== "string" ||
      typeof parsed.issuedAt !== "number"
    ) {
      return null;
    }
    return parsed as CashierShift;
  } catch {
    return null;
  }
}

export async function getCashierShiftCookie() {
  const cookieStore = await cookies();
  const value = cookieStore.get(CASHIER_SHIFT_COOKIE)?.value;
  return value ? decodeShift(value) : null;
}

export async function setCashierShiftCookie(shift: CashierShift) {
  const cookieStore = await cookies();
  cookieStore.set(CASHIER_SHIFT_COOKIE, encodeShift(shift), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/cashier",
    maxAge: 60 * 60 * 12
  });
}

export async function clearCashierShiftCookie() {
  const cookieStore = await cookies();
  cookieStore.set(CASHIER_SHIFT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/cashier",
    maxAge: 0
  });
}
