"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-auth";

interface DashboardTopbarProps {
  title: string;
  subtitle?: string;
}

export function DashboardTopbar({ title, subtitle }: DashboardTopbarProps) {
  const { data: user } = useCurrentUser();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card">
      <div>
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
          <span className="text-xs text-muted-foreground">Balance</span>
          <span className="text-sm font-bold text-primary font-mono">{formatCurrency(user?.balance ?? 0)}</span>
        </div>
        <Link
          href="/notifications"
          className="relative p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}