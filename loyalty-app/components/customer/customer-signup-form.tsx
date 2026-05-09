"use client";

import { useActionState } from "react";
import { signUpCustomer, type SignupState } from "@/app/customer/actions";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";

const initialState: SignupState = {};

export function CustomerSignupForm() {
  const [state, formAction, pending] = useActionState(signUpCustomer, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <Input label="Name" name="name" autoComplete="name" required />
      <Input label="Email" name="email" type="email" autoComplete="email" required />
      <Input label="Phone" name="phone" type="tel" autoComplete="tel" required />
      {state.error ? <p className="text-sm text-error-text">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Creating..." : "Create account"}
      </Button>
    </form>
  );
}
