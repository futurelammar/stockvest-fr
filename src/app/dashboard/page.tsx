"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, Wallet, ArrowRight, Clock } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useTransactionSummary, useTransactions } from "@/hooks/use-transactions";
import { useMyInvestments } from "@/hooks/use-investments";
import { StatCard } from "@/components/dashboard/stat-card";

function formatMoney(n: number | undefined | null) {
  const num = typeof n === "number" && isFinite(n) ? n : 0;
  return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// The backend stores adjustments as "Admin balance adjustment: <reason>".
// Users only need to see the reason itself.
const ADJUSTMENT_PREFIX = "Admin balance adjustment:";

function adjustmentReason(description?: string | null) {
  const text = (description ?? "").trim();
  if (!text) return "Adjustment";
  if (text.startsWith(ADJUSTMENT_PREFIX)) {
    return text.slice(ADJUSTMENT_PREFIX.length).trim() || "Adjustment";
  }
  return text;
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#E5E0D4] ${className}`} />;
}

export default function OverviewPage() {
  const { data: user } = useCurrentUser();
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();
  const { data: recentTx, isLoading: txLoading } = useTransactions({ limit: 5 });
  const { data: investments, isLoading: investmentsLoading } = useMyInvestments({
    limit: 3,
    status: "active",
  });

  // ── Derive totalInvested from investments if summary doesn't carry it ──
  // Some backends return it under different keys — check all known variants.
  const totalInvested: number =
    (summary as any)?.totalInvested ??
    (summary as any)?.invested ??
    (summary as any)?.totalAmountInvested ??
    0;

  const totalDeposited: number =
    (summary as any)?.totalDeposited ??
    (summary as any)?.deposited ??
    0;

  const totalProfit: number =
    (summary as any)?.totalProfit ??
    (summary as any)?.profit ??
    (summary as any)?.totalProfitPaid ??
    0;

  const totalWithdrawn: number =
    (summary as any)?.totalWithdrawn ??
    (summary as any)?.withdrawn ??
    0;

  return (
    <div className="space-y-8">
      {/* ── Balance hero ── */}
      <div className="rounded-2xl bg-[#0E1A17] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Available balance</p>
        <p className="mt-2 font-mono text-4xl font-semibold text-white">{formatMoney(user?.balance)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/deposit"
            className="inline-flex items-center rounded-lg bg-[#1F6F4F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#186040]"
          >
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Deposit
          </Link>
          <Link
            href="/plans"
            className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <TrendingUp className="mr-2 h-4 w-4" /> Invest
          </Link>
          <Link
            href="/dashboard/withdraw"
            className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <ArrowUpFromLine className="mr-2 h-4 w-4" /> Withdraw
          </Link>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-28" />)
        ) : (
          <>
            <StatCard
              label="Total Deposited"
              value={formatMoney(totalDeposited)}
              icon={ArrowDownToLine}
              tone="emerald"
            />
            <StatCard
              label="Total Invested"
              value={formatMoney(totalInvested)}
              icon={Wallet}
            />
            <StatCard
              label="Total Profit"
              value={formatMoney(totalProfit)}
              icon={TrendingUp}
              tone="gold"
            />
            <StatCard
              label="Total Withdrawn"
              value={formatMoney(totalWithdrawn)}
              icon={ArrowUpFromLine}
            />
          </>
        )}
      </div>

      {/* ── Activity panels ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active investments */}
        <div className="rounded-xl border border-[#E5E0D4] bg-white">
          <div className="flex items-center justify-between border-b border-[#E5E0D4] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[#0E1A17]">Active investments</h2>
            <Link href="/dashboard/investments" className="flex items-center text-xs text-[#1F6F4F] hover:underline">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#F1EDE2]">
            {investmentsLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-4">
                  <SkeletonBlock className="h-4 w-40" />
                </div>
              ))}

            {!investmentsLoading && (investments?.data ?? []).length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-[#5B6661]">
                No active investments yet —{" "}
                <Link href="/plans" className="text-[#1F6F4F] underline-offset-2 hover:underline">
                  browse plans
                </Link>
                .
              </p>
            )}

            {!investmentsLoading &&
              (investments?.data ?? []).map((inv) => {
                const msLeft = new Date(inv.maturityDate).getTime() - Date.now();
                const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
                return (
                  <div key={inv._id} className="flex items-center justify-between px-5 py-4">
                    <div className="min-w-0 pr-4">
                      <p className="truncate text-sm font-medium text-[#0E1A17]">{inv.plan?.planName}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[#5B6661]">
                        <Clock className="h-3 w-3 shrink-0" />
                        {daysLeft} day{daysLeft === 1 ? "" : "s"} left
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-sm font-medium text-[#0E1A17]">
                        {formatMoney(inv.amountInvested)}
                      </p>
                      <p className="font-mono text-xs text-[#1F6F4F]">
                        +{formatMoney(inv.expectedProfit)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="rounded-xl border border-[#E5E0D4] bg-white">
          <div className="flex items-center justify-between border-b border-[#E5E0D4] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[#0E1A17]">Recent transactions</h2>
            <Link
              href="/dashboard/transactions"
              className="flex items-center text-xs text-[#1F6F4F] hover:underline"
            >
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#F1EDE2]">
            {txLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-4">
                  <SkeletonBlock className="h-4 w-40" />
                </div>
              ))}

            {!txLoading && (recentTx?.data ?? []).length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-[#5B6661]">No transactions yet.</p>
            )}

            {!txLoading &&
              (recentTx?.data ?? []).map((tx) => {
                const isAdjustment = tx.type === "adjustment";
                return (
                  <div key={tx._id} className="flex items-center justify-between px-5 py-4">
                    <div className="min-w-0 pr-4">
                      <p
                        className={`text-sm font-medium text-[#0E1A17] ${
                          isAdjustment ? "break-words" : "capitalize"
                        }`}
                      >
                        {isAdjustment ? adjustmentReason(tx.description) : tx.type}
                      </p>
                      <p className="mt-0.5 text-xs text-[#5B6661]">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p
                      className={[
                        "shrink-0 font-mono text-sm font-medium",
                        tx.type === "withdrawal" ? "text-[#A8392F]" : "text-[#1F6F4F]",
                      ].join(" ")}
                    >
                      {tx.type === "withdrawal" ? "-" : "+"}
                      {formatMoney(tx.amount)}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}