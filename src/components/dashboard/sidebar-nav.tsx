"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, ArrowDownToLine, ArrowUpFromLine, Receipt, Bell, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/investments", label: "My Investments", icon: Wallet },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownToLine },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active ? "bg-white/10 font-medium text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}