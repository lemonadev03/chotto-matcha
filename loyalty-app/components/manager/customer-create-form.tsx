"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { createCustomerAccount, type CreateAccountState } from "@/app/manager/actions";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Pill } from "@/components/shared/pill";

const initialState: CreateAccountState = {};

export function CustomerCreateForm() {
  const [state, formAction, pending] = useActionState(createCustomerAccount, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <Input label="Name" name="name" required />
      <Input label="Email" name="email" type="email" required />
      <Input label="Phone" name="phone" type="tel" required />
      {state.error ? <p className="text-sm text-error-text">{state.error}</p> : null}
      {state.invitationSent ? (
        <div className="rounded-md border border-sage-tint bg-sage-wash p-4">
          <Pill icon={Mail}>Invitation email sent</Pill>
          <p className="mt-3 text-sm text-charcoal">{state.email} can sign in with the secure link.</p>
        </div>
      ) : null}
      {state.invitationFailed ? (
        <div className="rounded-md border border-error-border bg-cream p-4">
          <Pill tone="warn">Account created</Pill>
          <p className="mt-3 text-sm text-charcoal">
            {state.email} was created, but the invitation email could not be sent.
          </p>
        </div>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create customer account"}
      </Button>
    </form>
  );
}
