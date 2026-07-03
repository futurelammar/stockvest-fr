"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { NotificationsBell } from "./notifications-bell";
import { UserMenu } from "./user-menu";
import type { AuthUser } from "@/types/auth";

export function DashboardShell({ user, children }: { user: AuthUser; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F4EE]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#0E1A17] px-4 py-6 lg:flex">
        <Link href="/" className="mb-8 px-2 font-display text-xl font-bold text-white">
          AutoBull<span className="text-emerald-400">.</span>
        </Link>
        <SidebarNav />
        <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Balance</p>
          <p className="mt-1 font-mono text-lg font-semibold text-white">
            ${user.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00"}
          </p>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[#0E1A17] px-4 py-6">
            <div className="mb-8 flex items-center justify-between px-2">
              <span className="font-display text-xl font-bold text-white">
                AutoBull<span className="text-emerald-400">.</span>
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5 text-white/70" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E0D4] bg-[#F7F4EE]/95 px-4 backdrop-blur sm:px-8">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5 text-[#0E1A17]" />
          </button>
          <span className="hidden text-sm text-[#5B6661] lg:inline">
            Welcome back, <span className="font-medium text-[#0E1A17]">{user.fullName.split(" ")[0]}</span>
          </span>
          <div className="flex items-center gap-3">
            <NotificationsBell />
            <UserMenu user={user} />
          </div>
        </header>

        <main className="px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}