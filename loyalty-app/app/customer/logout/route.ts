import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

export async function POST(request: Request) {
  await auth.api.signOut({ headers: await headers() });
  return NextResponse.redirect(new URL("/customer/login", request.url), { status: 303 });
}
