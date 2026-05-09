import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";

export async function POST(request: Request) {
  await auth.api.signOut({ headers: await headers() });
  const url = new URL("/manager/login", request.url);
  return NextResponse.redirect(url, { status: 303 });
}
