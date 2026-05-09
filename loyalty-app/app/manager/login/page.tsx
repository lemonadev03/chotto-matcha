import { redirect } from "next/navigation";
import { Brand } from "@/components/shared/brand";
import { ManagerLoginForm } from "@/components/manager/manager-login-form";
import { getSession } from "@/lib/auth/session";

export default async function ManagerLoginPage() {
  const session = await getSession();
  if (session) redirect("/manager");

  return (
    <main className="grain min-h-screen px-5 py-10">
      <div className="mx-auto flex max-w-md flex-col gap-8">
        <div className="flex justify-center">
          <Brand href="/" />
        </div>
        <div className="matcha-card rounded-[16px] p-8">
          <h1 className="font-display text-2xl text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-moss/80">Manager access only.</p>
          <div className="mt-6">
            <ManagerLoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
