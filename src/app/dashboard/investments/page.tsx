// src/app/(dashboard)/dashboard/investments/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Calendar,
  DollarSign,
  BarChart2,
  Layers,
  AlertCircle,
} from "lucide-react";
import { useMyInvestments } from "@/hooks/use-investments";
import type { Investment, InvestmentStatusValue } from "@/types/investment";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function formatMoney(n: number | undefined) {
  return `$${(n ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function daysLeft(maturityDate: string) {
  return Math.max(
    0,
    Math.ceil(
      (new Date(maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );
}

function daysElapsed(startDate: string) {
  return Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  );
}

function progressPercent(inv: Investment) {
  const elapsed = daysElapsed(inv.startDate);
  return Math.min(100, Math.round((elapsed / inv.durationInDays) * 100));
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ─────────────────────────────────────────
   Status badge
───────────────────────────────────────── */
function StatusBadge({ status }: { status: InvestmentStatusValue }) {
  const map: Record<
    InvestmentStatusValue,
    { label: string; bg: string; text: string; icon: React.ReactNode }
  > = {
    active: {
      label: "Active",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: <TrendingUp className="h-3 w-3" />,
    },
    completed: {
      label: "Completed",
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-rose-50",
      text: "text-rose-600",
      icon: <XCircle className="h-3 w-3" />,
    },
  };
  const { label, bg, text, icon } = map[status] ?? map.active;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${bg} ${text}`}
    >
      {icon}
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────
   Skeleton row
───────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center justify-between px-5 py-4 border-b border-[#F1EDE2] last:border-0">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-[#E5E0D4]" />
        <div className="space-y-2">
          <div className="h-3.5 w-36 rounded bg-[#E5E0D4]" />
          <div className="h-2.5 w-24 rounded bg-[#E5E0D4]" />
        </div>
      </div>
      <div className="hidden space-y-2 sm:block">
        <div className="h-3.5 w-20 rounded bg-[#E5E0D4]" />
        <div className="h-2.5 w-14 rounded bg-[#E5E0D4]" />
      </div>
      <div className="h-3.5 w-20 rounded bg-[#E5E0D4]" />
      <div className="h-5 w-16 rounded-full bg-[#E5E0D4]" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Investment row
───────────────────────────────────────── */
function InvestmentRow({
  inv,
  onClick,
}: {
  inv: Investment;
  onClick: () => void;
}) {
  const pct = progressPercent(inv);
  const remaining = daysLeft(inv.maturityDate);

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between px-5 py-4 border-b border-[#F1EDE2] last:border-0 hover:bg-[#FAFAF7] transition-colors group"
    >
      {/* Plan avatar + name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0E1A17] text-xs font-bold text-emerald-400">
          {inv.plan.stock?.ticker?.slice(0, 2) ??
            inv.plan.planName.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#0E1A17]">
            {inv.plan.planName}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            {inv.plan.stock?.ticker && (
              <span className="font-mono text-[10px] text-[#5B6661]">
                {inv.plan.stock.ticker}
              </span>
            )}
            {inv.status === "active" && (
              <span className="flex items-center gap-0.5 text-[10px] text-[#5B6661]">
                <Clock className="h-3 w-3" />
                {remaining}d left
              </span>
            )}
            {inv.status === "completed" && (
              <span className="text-[10px] text-blue-600">
                Completed {fmtDate(inv.maturityDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar — active only, lg screens */}
      {inv.status === "active" && (
        <div className="mx-6 hidden w-32 lg:block">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] text-[#5B6661]">Progress</span>
            <span className="text-[10px] font-medium text-[#0E1A17]">{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E0D4]">
            <div
              className="h-full rounded-full bg-[#1F6F4F] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Amount + profit */}
      <div className="mx-4 hidden text-right sm:block">
        <p className="font-mono text-sm font-semibold text-[#0E1A17]">
          {formatMoney(inv.amountInvested)}
        </p>
        <p className="font-mono text-xs text-[#1F6F4F]">
          +{formatMoney(inv.expectedProfit)}
        </p>
      </div>

      {/* Status + arrow */}
      <div className="flex flex-shrink-0 items-center gap-3">
        <StatusBadge status={inv.status} />
        <ArrowRight className="hidden h-4 w-4 text-[#B0AAA0] transition-colors group-hover:text-[#1F6F4F] sm:block" />
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────
   Detail drawer — uses data already in list
   (no separate endpoint needed)
───────────────────────────────────────── */
function InvestmentDrawer({
  inv,
  onClose,
}: {
  inv: Investment;
  onClose: () => void;
}) {
  const pct = progressPercent(inv);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D4] px-6 py-4">
          <h2 className="font-display text-lg font-bold text-[#0E1A17]">
            Investment details
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F1EDE2] transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-[#5B6661]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* Plan hero */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#0E1A17] text-sm font-bold text-emerald-400">
              {inv.plan.stock?.ticker?.slice(0, 2) ??
                inv.plan.planName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-display text-xl font-bold text-[#0E1A17]">
                {inv.plan.planName}
              </p>
              {inv.plan.stock?.ticker && (
                <p className="mt-0.5 font-mono text-xs text-[#5B6661]">
                  {inv.plan.stock.ticker}
                  {typeof inv.plan.stock.changePercent === "number" && (
                    <>
                      {" · "}
                      <span
                        className={
                          inv.plan.stock.changePercent >= 0
                            ? "text-[#1F6F4F]"
                            : "text-[#A8392F]"
                        }
                      >
                        {inv.plan.stock.changePercent >= 0 ? "+" : ""}
                        {inv.plan.stock.changePercent.toFixed(2)}%
                      </span>
                    </>
                  )}
                </p>
              )}
              <div className="mt-2">
                <StatusBadge status={inv.status} />
              </div>
            </div>
          </div>

          {/* Progress bar — active only */}
          {inv.status === "active" && (
            <div className="rounded-xl bg-[#F7F4EE] p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-[#0E1A17]">Duration progress</span>
                <span className="font-mono font-semibold text-[#1F6F4F]">{pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E0D4]">
                <div
                  className="h-full rounded-full bg-[#1F6F4F] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#5B6661]">
                <span>{daysElapsed(inv.startDate)} days elapsed</span>
                <span>{daysLeft(inv.maturityDate)} days remaining</span>
              </div>
            </div>
          )}

          {/* Key figures */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: DollarSign,
                label: "Amount invested",
                value: formatMoney(inv.amountInvested),
                green: false,
              },
              {
                icon: TrendingUp,
                label: "Expected profit",
                value: `+${formatMoney(inv.expectedProfit)}`,
                green: true,
              },
              {
                icon: BarChart2,
                label: "ROI",
                value: `${inv.roiPercentage}%`,
                green: false,
              },
              {
                icon: Layers,
                label: "Duration",
                value: `${inv.durationInDays} days`,
                green: false,
              },
            ].map(({ icon: Icon, label, value, green }) => (
              <div
                key={label}
                className="rounded-xl border border-[#E5E0D4] bg-white p-4"
              >
                <div className="mb-2 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-[#5B6661]" />
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#5B6661]">
                    {label}
                  </p>
                </div>
                <p
                  className={`font-mono text-lg font-bold ${
                    green ? "text-[#1F6F4F]" : "text-[#0E1A17]"
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Total return highlight */}
          <div className="flex items-center justify-between rounded-xl bg-[#0E1A17] px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Total return at maturity
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-white">
                {formatMoney(inv.amountInvested + inv.expectedProfit)}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-400 opacity-60" />
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5B6661]">
              Timeline
            </p>
            <div className="divide-y divide-[#F1EDE2] rounded-xl border border-[#E5E0D4]">
              {[
                { icon: Calendar, label: "Start date", value: fmtDate(inv.startDate) },
                { icon: Calendar, label: "Maturity date", value: fmtDate(inv.maturityDate) },
                {
                  icon: CheckCircle2,
                  label: "Profit credited",
                  value: inv.profitCredited ? "Yes" : "Pending",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-xs text-[#5B6661]">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      label === "Profit credited" && inv.profitCredited
                        ? "text-[#1F6F4F]"
                        : "text-[#0E1A17]"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          {inv.plan.stock && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
              <p className="text-[11px] leading-relaxed text-amber-800">
                Plan inspired by {inv.plan.stock.ticker} · returns are
                platform-determined, not brokered.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   Summary cards (derived from all investments)
───────────────────────────────────────── */
function SummaryCards({ investments }: { investments: Investment[] }) {
  const active = investments.filter((i) => i.status === "active").length;
  const completed = investments.filter((i) => i.status === "completed").length;
  const totalInvested = investments.reduce((s, i) => s + i.amountInvested, 0);
  const totalProfit = investments
    .filter((i) => i.profitCredited)
    .reduce((s, i) => s + i.expectedProfit, 0);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[
        { label: "Total invested", value: formatMoney(totalInvested), icon: DollarSign, green: false, mono: true },
        { label: "Active plans", value: String(active), icon: TrendingUp, green: false, mono: false },
        { label: "Completed plans", value: String(completed), icon: CheckCircle2, green: false, mono: false },
        { label: "Profit earned", value: formatMoney(totalProfit), icon: BarChart2, green: true, mono: true },
      ].map(({ label, value, icon: Icon, green, mono }) => (
        <div key={label} className="rounded-xl border border-[#E5E0D4] bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              {label}
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F4EE]">
              <Icon className="h-4 w-4 text-[#1F6F4F]" />
            </div>
          </div>
          <p
            className={`text-2xl font-bold ${mono ? "font-mono" : "font-display"} ${
              green ? "text-[#1F6F4F]" : "text-[#0E1A17]"
            }`}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Tab definitions
───────────────────────────────────────── */
type FilterTab = "all" | InvestmentStatusValue;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
export default function InvestmentsPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Investment | null>(null);

  const LIMIT = 10;

  // Filtered + paginated list shown in the table
  const { data, isLoading } = useMyInvestments({
    page,
    limit: LIMIT,
    ...(tab !== "all" && { status: tab }),
  });

  // All investments (high limit) used only for summary cards
  const { data: allData } = useMyInvestments({ page: 1, limit: 200 });

  const investments = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;
  const allInvestments = allData?.data ?? [];

  function handleTabChange(t: FilterTab) {
    setTab(t);
    setPage(1);
  }

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0E1A17]">
            My Investments
          </h1>
          <p className="mt-0.5 text-sm text-[#5B6661]">
            Track all your active and past investment plans.
          </p>
        </div>
        <Link
          href="/plans"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#186040]"
        >
          <TrendingUp className="h-4 w-4" />
          New investment
        </Link>
      </div>

      {/* ── Summary cards ── */}
      {allInvestments.length > 0 && (
        <SummaryCards investments={allInvestments} />
      )}

      {/* ── Table card ── */}
      <div className="rounded-xl border border-[#E5E0D4] bg-white">

        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-[#E5E0D4] px-4 py-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-[#0E1A17] text-white"
                  : "text-[#5B6661] hover:bg-[#F7F4EE] hover:text-[#0E1A17]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Column header row */}
        <div className="hidden grid-cols-[1fr_160px_160px_100px] items-center gap-4 border-b border-[#F1EDE2] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#5B6661] lg:grid">
          <span>Plan</span>
          <span>Progress</span>
          <span>Amount / Profit</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        <div>
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

          {!isLoading && investments.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F4EE]">
                <TrendingUp className="h-7 w-7 text-[#5B6661]" />
              </div>
              <p className="mt-4 font-display text-lg font-semibold text-[#0E1A17]">
                {tab === "all" ? "No investments yet" : `No ${tab} investments`}
              </p>
              <p className="mt-1 max-w-xs text-sm text-[#5B6661]">
                {tab === "all"
                  ? "Browse our curated plans and make your first investment."
                  : `You don't have any ${tab} investments at the moment.`}
              </p>
              {tab === "all" && (
                <Link
                  href="/plans"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#186040]"
                >
                  Browse plans
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}

          {!isLoading &&
            investments.map((inv) => (
              <InvestmentRow
                key={inv._id}
                inv={inv}
                onClick={() => setSelected(inv)}
              />
            ))}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E0D4] px-5 py-4">
            <p className="text-xs text-[#5B6661]">
  Page {page} of {totalPages} · {data?.meta.total} investments
</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D4] text-[#5B6661] transition-colors hover:border-[#1F6F4F] hover:text-[#1F6F4F] disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`e-${i}`} className="px-1 text-xs text-[#5B6661]">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-[#0E1A17] text-white"
                          : "border border-[#E5E0D4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D4] text-[#5B6661] transition-colors hover:border-[#1F6F4F] hover:text-[#1F6F4F] disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail drawer ── */}
      {selected && (
        <InvestmentDrawer inv={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}