import { redirect } from "next/navigation";
import { Brand } from "@/components/shared/brand";
import { EmailLoginForm } from "@/components/auth/email-login-form";
import { getSession } from "@/lib/auth/session";

export default async function CashierLoginPage() {
  const session = await getSession();
  if (session) redirect("/cashier");

  return (
    <main className="min-h-screen bg-cream py-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/" size="md" />
        </div>
        <section className="rounded-lg border border-line-soft bg-cream p-8 shadow-sm">
          <p className="eyebrow text-matcha-deep">Cashier</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-9 text-charcoal">
            Sign in before your shift.
          </h1>
          <div className="mt-6">
            <EmailLoginForm callbackURL="/cashier" placeholder="mika@chottomatcha.ph" />
          </div>
        </section>
      </div>
    </main>
  );
}
