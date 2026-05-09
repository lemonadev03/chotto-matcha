"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth/client";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";

export function EmailLoginForm({
  callbackURL,
  placeholder = "you@example.com",
  role = "customer"
}: {
  callbackURL: string;
  placeholder?: string;
  role?: "customer" | "cashier" | "manager";
}) {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSentTo(null);
    setPending(true);
    const normalizedEmail = email.trim().toLowerCase();
    const result = await signIn.magicLink({
      email: normalizedEmail,
      callbackURL,
      errorCallbackURL: callbackURL,
      metadata: { intent: "login", role }
    });
    setPending(false);
    if (result.error) {
      setError(result.error.message ?? "Could not send sign-in link");
      return;
    }
    setSentTo(normalizedEmail);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
      />
      {error ? <p className="text-sm text-error-text">{error}</p> : null}
      {sentTo ? (
        <p className="rounded-md border border-sage-tint bg-sage-wash p-3 text-sm leading-6 text-matcha-deep">
          Check {sentTo} for a secure sign-in link.
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Sending..." : "Send sign-in link"}
      </Button>
    </form>
  );
}
