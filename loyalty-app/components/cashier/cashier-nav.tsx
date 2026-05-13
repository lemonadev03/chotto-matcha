"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, ScanLine, Settings } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<LucideProps>;
};

const items: NavItem[] = [
  { href: "/cashier", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cashier/identify", label: "Identify", icon: ScanLine }
];

export function CashierNav() {
  const pathname = usePathname() ?? "/cashier";

  return (
    <nav className="relative z-10 flex h-full flex-col">
      <div className="grid gap-2">
        {items.map((item) => {
          const isActive =
            item.href === "/cashier"
              ? pathname === "/cashier"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "grid min-h-[68px] place-items-center gap-1 rounded-md px-2 py-2 text-center text-[11px] font-medium transition-colors duration-fast ease-out-soft",
                isActive
                  ? "bg-cream text-matcha-deep shadow-sm"
                  : "text-[rgba(250,247,242,0.82)] hover:bg-white/10 hover:text-[#FAF7F2]"
              )}
            >
              <Icon
                className={clsx("h-5 w-5", isActive ? "text-matcha-deep" : "text-[rgba(250,247,242,0.88)]")}
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-auto grid min-h-[68px] place-items-center gap-1 rounded-md px-2 py-2 text-center text-[11px] font-medium text-[rgba(250,247,242,0.76)]">
        <Settings className="h-5 w-5 text-[rgba(250,247,242,0.82)]" strokeWidth={1.75} aria-hidden="true" />
        Settings
      </div>
    </nav>
  );
}
