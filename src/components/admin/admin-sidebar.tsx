"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BarChart3,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  Settings,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAdminOverview } from "@/hooks/use-admin-dashboard";

const NAV_ITEMS = [
  { href: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/plans", label: "Investment Plans", icon: TrendingUp },
  { href: "/admin/stocks", label: "Stocks", icon: BarChart3 },
  { href: "/admin/deposits", label: "Deposits", icon: ArrowDownToLine, badgeKey: "deposits" as const },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine, badgeKey: "withdrawals" as const },
  { href: "/admin/wallets", label: "Wallets", icon: Wallet },
  { href: "/admin/settings", label: "Site Content", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: overview } = useAdminOverview();

  const badgeCounts: Record<string, number | undefined> = {
    deposits: overview?.deposits.pending,
    withdrawals: overview?.withdrawals.pending,
  };

  return (
    <div className="flex h-full flex-col bg-[#0E1A17]">
      <div className="flex items-center gap-2 px-5 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400">
          <ShieldCheck className="h-4 w-4 text-[#0B241B]" />
        </span>
        <div>
          <p className="font-display text-base font-bold text-white">
            Ledger<span className="text-emerald-300">.</span>
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300/80">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const badge = item.badgeKey ? badgeCounts[item.badgeKey] : undefined;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-emerald-400/15 text-emerald-300" : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </span>
              {!!badge && badge > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C9A24B] px-1.5 text-[10px] font-bold text-[#0E1A17]">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <Link href="/dashboard/overview" className="text-xs text-white/40 hover:text-white/70">
          ← Back to user dashboard
        </Link>
      </div>
    </div>
  );
}

export function AdminSidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Desktop — fixed, always visible */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile — slide-in drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="animate-in slide-in-from-left absolute inset-y-0 left-0 w-64 duration-200">
            <div className="relative h-full">
              <button
                onClick={onClose}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent onNavigate={onClose} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}