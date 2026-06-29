"use client";

import Link from "next/link";
import {
  Users,
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRight,
  Clock,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { useAdminOverview, useAdminRecentActivity } from "@/hooks/use-admin-dashboard";

function formatMoney(n: number | undefined) {
  return `$${(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#E5E0D4] ${className}`} />;
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  sub,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  tone?: "default" | "emerald" | "gold" | "rose";
  sub?: string;
}) {
  const toneClass =
    tone === "emerald"
      ? "text-[#1F6F4F]"
      : tone === "gold"
      ? "text-[#C9A24B]"
      : tone === "rose"
      ? "text-[#A8392F]"
      : "text-[#0E1A17]";
  return (
    <div className="rounded-xl border border-[#E5E0D4] bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#5B6661] sm:text-xs">{label}</p>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F4EE]">
          <Icon className="h-4 w-4 text-[#1F6F4F]" />
        </div>
      </div>
      <p className={`font-mono text-xl font-bold sm:text-2xl ${toneClass}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-[#5B6661]">{sub}</p>}
    </div>
  );
}

function ActivityPanel({
  title,
  href,
  loading,
  empty,
  children,
}: {
  title: string;
  href: string;
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#E5E0D4] bg-white">
      <div className="flex items-center justify-between border-b border-[#E5E0D4] px-5 py-4">
        <h2 className="font-display text-base font-semibold text-[#0E1A17]">{title}</h2>
        <Link href={href} className="flex items-center text-xs text-[#1F6F4F] hover:underline">
          View all <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-[#F1EDE2]">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-5 py-4">
              <SkeletonBlock className="h-4 w-40" />
            </div>
          ))}
        {!loading && empty && <p className="px-5 py-8 text-center text-sm text-[#5B6661]">Nothing here yet.</p>}
        {!loading && !empty && children}
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data: overview, isLoading: overviewLoading } = useAdminOverview();
  const { data: activity, isLoading: activityLoading } = useAdminRecentActivity(5);

  const hasPending = (overview?.deposits.pending ?? 0) > 0 || (overview?.withdrawals.pending ?? 0) > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Admin Overview</h1>
        <p className="mt-0.5 text-sm text-[#5B6661]">A snapshot of everything happening on the platform.</p>
      </div>

      {!overviewLoading && hasPending && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-900">
            <Clock className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              {overview?.deposits.pending ?? 0} pending deposit{overview?.deposits.pending === 1 ? "" : "s"} and{" "}
              {overview?.withdrawals.pending ?? 0} pending withdrawal{overview?.withdrawals.pending === 1 ? "" : "s"} need
              review.
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/deposits"
              className="rounded-lg bg-[#0E1A17] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1a2e27]"
            >
              Review deposits
            </Link>
            <Link
              href="/admin/withdrawals"
              className="rounded-lg border border-[#0E1A17]/20 px-3 py-1.5 text-xs font-semibold text-[#0E1A17] hover:bg-white"
            >
              Review withdrawals
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonBlock key={i} className="h-28" />)
        ) : (
          <>
            <StatCard
              label="Total Users"
              value={String(overview?.users.total ?? 0)}
              icon={Users}
              sub={`${overview?.users.active ?? 0} active`}
            />
            <StatCard
              label="Active Plans"
              value={String(overview?.plans.active ?? 0)}
              icon={TrendingUp}
              sub={`of ${overview?.plans.total ?? 0} total`}
            />
            <StatCard
              label="Active Investments"
              value={String(overview?.investments.active ?? 0)}
              icon={Wallet}
              tone="emerald"
              sub={`${overview?.investments.completed ?? 0} completed`}
            />
            <StatCard
              label="Profit Paid Out"
              value={formatMoney(overview?.investments.totalProfitPaid)}
              icon={CheckCircle2}
              tone="gold"
            />
            <StatCard
              label="Total Deposited"
              value={formatMoney(overview?.deposits.totalDeposited)}
              icon={ArrowDownToLine}
              tone="emerald"
              sub={`${overview?.deposits.pending ?? 0} pending`}
            />
            <StatCard
              label="Total Withdrawn"
              value={formatMoney(overview?.withdrawals.totalWithdrawn)}
              icon={ArrowUpFromLine}
              tone="rose"
              sub={`${overview?.withdrawals.pending ?? 0} pending`}
            />
            <StatCard label="Total Invested" value={formatMoney(overview?.investments.totalInvested)} icon={TrendingUp} />
            <StatCard label="Admins" value={String(overview?.users.admins ?? 0)} icon={Users} />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityPanel
          title="Recent deposits"
          href="/admin/deposits"
          loading={activityLoading}
          empty={!activity?.recentDeposits.length}
        >
          {activity?.recentDeposits.map((dep) => (
            <div key={dep._id} className="flex items-center justify-between px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#0E1A17]">{dep.user?.fullName ?? "Unknown user"}</p>
                <p className="mt-0.5 text-xs text-[#5B6661]">
                  {fmtDate(dep.createdAt)} · {dep.status}
                </p>
              </div>
              <p className="font-mono text-sm font-medium text-[#1F6F4F]">{formatMoney(dep.amount)}</p>
            </div>
          ))}
        </ActivityPanel>

        <ActivityPanel
          title="Recent withdrawals"
          href="/admin/withdrawals"
          loading={activityLoading}
          empty={!activity?.recentWithdrawals.length}
        >
          {activity?.recentWithdrawals.map((w) => (
            <div key={w._id} className="flex items-center justify-between px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#0E1A17]">{w.user?.fullName ?? "Unknown user"}</p>
                <p className="mt-0.5 text-xs text-[#5B6661]">
                  {fmtDate(w.createdAt)} · {w.status}
                </p>
              </div>
              <p className="font-mono text-sm font-medium text-[#A8392F]">{formatMoney(w.amount)}</p>
            </div>
          ))}
        </ActivityPanel>

        <ActivityPanel
          title="Recent investments"
          href="/admin/plans"
          loading={activityLoading}
          empty={!activity?.recentInvestments.length}
        >
          {activity?.recentInvestments.map((inv) => (
            <div key={inv._id} className="flex items-center justify-between px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#0E1A17]">{inv.user?.fullName ?? "Unknown user"}</p>
                <p className="mt-0.5 truncate text-xs text-[#5B6661]">
                  {inv.plan?.planName} · {fmtDate(inv.createdAt)}
                </p>
              </div>
              <p className="font-mono text-sm font-medium text-[#0E1A17]">{formatMoney(inv.amountInvested)}</p>
            </div>
          ))}
        </ActivityPanel>

        <ActivityPanel
          title="New signups"
          href="/admin/users"
          loading={activityLoading}
          empty={!activity?.recentUsers.length}
        >
          {activity?.recentUsers.map((u) => (
            <div key={u._id} className="flex items-center justify-between px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F4EE] text-xs font-bold text-[#0E1A17]">
                  {u.fullName?.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#0E1A17]">{u.fullName}</p>
                  <p className="truncate text-xs text-[#5B6661]">{u.email}</p>
                </div>
              </div>
              <p className="flex items-center gap-1 text-xs text-[#5B6661]">
                <UserPlus className="h-3 w-3" /> {fmtDate(u.createdAt)}
              </p>
            </div>
          ))}
        </ActivityPanel>
      </div>
    </div>
  );
}