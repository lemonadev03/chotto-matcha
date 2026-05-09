"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/client";

export function ManagerLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const result = await signIn.email({ email, password, callbackURL: "/manager" });
    setPending(false);
    if (result.error) {
      setError(result.error.message ?? "Sign in failed");
      return;
    }
    router.push("/manager");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1 text-sm font-bold text-ink">
        Email
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-[8px] border border-moss/20 bg-white px-3 py-2 text-base font-normal text-ink focus:border-moss focus:outline-none"
        />
      </label>
      <label className="grid gap-1 text-sm font-bold text-ink">
        Password
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-[8px] border border-moss/20 bg-white px-3 py-2 text-base font-normal text-ink focus:border-moss focus:outline-none"
        />
      </label>
      {error ? (
        <p role="alert" className="rounded-[8px] bg-persimmon/10 px-3 py-2 text-sm font-bold text-persimmon">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-[8px] bg-matcha px-4 py-3 text-sm font-bold text-paper shadow-soft disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
