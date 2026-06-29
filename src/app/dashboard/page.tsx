"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, Wallet, ArrowRight, Clock } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useTransactionSummary, useTransactions } from "@/hooks/use-transactions";
import { useMyInvestments } from "@/hooks/use-investments";
import { StatCard } from "@/components/dashboard/stat-card";

function formatMoney(n: number | undefined) {
  return `$${(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#E5E0D4] ${className}`} />;
}

export default function OverviewPage() {
  const { data: user } = useCurrentUser();
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();
  const { data: recentTx, isLoading: txLoading } = useTransactions({ limit: 5 });
  const { data: investments, isLoading: investmentsLoading } = useMyInvestments({ limit: 3, status: "active" });

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-[#0E1A17] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Available balance</p>
        <p className="mt-2 font-mono text-4xl font-semibold tabular-nums text-white">{formatMoney(user?.balance)}</p>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-28" />)
        ) : (
          <>
            <StatCard label="Total Deposited" value={formatMoney(summary?.totalDeposited)} icon={ArrowDownToLine} tone="emerald" />
            <StatCard label="Total Invested" value={formatMoney(summary?.totalInvested)} icon={Wallet} />
            <StatCard label="Total Profit" value={formatMoney(summary?.totalProfit)} icon={TrendingUp} tone="gold" />
            <StatCard label="Total Withdrawn" value={formatMoney(summary?.totalWithdrawn)} icon={ArrowUpFromLine} />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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

            {!investmentsLoading && investments?.data.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-[#5B6661]">
                No active investments yet —{" "}
                <Link href="/plans" className="text-[#1F6F4F] underline-offset-2 hover:underline">
                  browse plans
                </Link>
                .
              </p>
            )}

            {!investmentsLoading &&
              investments?.data.map((inv) => {
                const daysLeft = Math.max(
                  0,
                  Math.ceil((new Date(inv.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                );
                return (
                  <div key={inv._id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-[#0E1A17]">{inv.plan.planName}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[#5B6661]">
                        <Clock className="h-3 w-3" /> {daysLeft} day{daysLeft === 1 ? "" : "s"} left
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-medium text-[#0E1A17]">{formatMoney(inv.amountInvested)}</p>
                      <p className="font-mono text-xs text-[#1F6F4F]">+{formatMoney(inv.expectedProfit)}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E0D4] bg-white">
          <div className="flex items-center justify-between border-b border-[#E5E0D4] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[#0E1A17]">Recent transactions</h2>
            <Link href="/dashboard/transactions" className="flex items-center text-xs text-[#1F6F4F] hover:underline">
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

            {!txLoading && recentTx?.data.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-[#5B6661]">No transactions yet.</p>
            )}

            {!txLoading &&
              recentTx?.data.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium capitalize text-[#0E1A17]">{tx.type}</p>
                    <p className="mt-0.5 text-xs text-[#5B6661]">
                      {new Date(tx.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <p className={`font-mono text-sm font-medium ${tx.type === "withdrawal" ? "text-[#A8392F]" : "text-[#1F6F4F]"}`}>
                    {tx.type === "withdrawal" ? "-" : "+"}
                    {formatMoney(tx.amount)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}