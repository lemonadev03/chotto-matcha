import { Brand } from "@/components/shared/brand";

export default function ManagerAccessDeniedPage() {
  return (
    <main className="grain min-h-screen px-5 py-10">
      <div className="mx-auto flex max-w-md flex-col gap-8">
        <div className="flex justify-center">
          <Brand href="/" />
        </div>
        <div className="matcha-card rounded-[16px] p-8">
          <h1 className="font-display text-2xl text-ink">Access denied</h1>
          <p className="mt-2 text-sm text-moss/80">
            You&apos;re signed in, but no active manager profile is linked to this account. Ask an
            existing manager to grant access, or sign out and try a different account.
          </p>
          <form action="/manager/logout" method="post" className="mt-6">
            <button
              type="submit"
              className="rounded-[8px] border border-moss/20 bg-white px-4 py-2 text-sm font-bold text-moss"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
