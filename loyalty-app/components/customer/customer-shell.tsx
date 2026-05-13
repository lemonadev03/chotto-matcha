import Link from "next/link";
import { UserRound } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { BottomNav } from "@/components/customer/bottom-nav";

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="customer-surface min-h-screen pb-40 pt-5">
      <div className="mx-auto max-w-md px-5">
        <header className="mb-5 flex items-center justify-between">
          <Brand href="/customer" size="md" />
          <Link
            href="/customer/profile"
            aria-label="Profile"
            className="grid h-10 w-10 place-items-center rounded-pill border border-line-soft bg-milk text-charcoal shadow-sm transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep"
          >
            <UserRound className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </header>
        {children}
      </div>
      <BottomNav />
    </main>
  );
}
