import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import type { Role } from "@/lib/types";

type MagicLinkIntent = "login" | "invite" | "signup";

export async function sendSignInLink({
  email,
  callbackURL,
  intent,
  role
}: {
  email: string;
  callbackURL: string;
  intent: MagicLinkIntent;
  role: Role;
}) {
  await auth.api.signInMagicLink({
    headers: await headers(),
    body: {
      email,
      callbackURL,
      errorCallbackURL: callbackURL,
      metadata: {
        intent,
        role
      }
    }
  });
}
