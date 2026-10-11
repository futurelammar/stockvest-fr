"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from "lucide-react";
import { useTransactionSummary, useTransactions } from "@/hooks/use-transactions";
import type { Transaction, TransactionType, TransactionStatusValue } from "@/types/transaction";

/* ─── Helpers ──────────────────────────────────────────────────── */
function formatMoney(n: number | undefined | null) {
  const num = typeof n === "number" && isFinite(n) ? n : 0;
  return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── Type config ──────────────────────────────────────────────── */
const TYPE_CONFIG: Record<
  TransactionType,
  { label: string; icon: React.ElementType; sign: "+" | "-"; color: string; bg: string }
> = {
  deposit:    { label: "Deposit",    icon: ArrowDownToLine, sign: "+", color: "text-[#1F6F4F]", bg: "bg-emerald-50" },
  profit:     { label: "Profit",     icon: TrendingUp,      sign: "+", color: "text-[#1F6F4F]", bg: "bg-emerald-50" },
  withdrawal: { label: "Withdrawal", icon: ArrowUpFromLine, sign: "-", color: "text-[#A8392F]", bg: "bg-rose-50"    },
  investment: { label: "Investment", icon: Wallet,          sign: "-", color: "text-[#0E1A17]", bg: "bg-[#F7F4EE]" },
  adjustment: { label: "Adjustment", icon: Receipt,         sign: "+", color: "text-[#5B6661]", bg: "bg-[#F7F4EE]" },
};

/* ─── Status badge ─────────────────────────────────────────────── */
function StatusBadge({ status }: { status: TransactionStatusValue }) {
  const map: Record<TransactionStatusValue, { label: string; bg: string; text: string; Icon: React.ElementType }> = {
    pending:   { label: "Pending",   bg: "bg-amber-50",   text: "text-amber-700",   Icon: Clock       },
    completed: { label: "Completed", bg: "bg-emerald-50", text: "text-emerald-700", Icon: CheckCircle2 },
    failed:    { label: "Failed",    bg: "bg-rose-50",    text: "text-rose-600",    Icon: XCircle     },
  };
  const { label, bg, text, Icon } = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${bg} ${text}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

/* ─── Copy reference ───────────────────────────────────────────── */
function ReferenceCopy({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    // Use older execCommand fallback for iOS Safari < 13.4
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reference).catch(() => fallbackCopy(reference));
    } else {
      fallbackCopy(reference);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function fallbackCopy(text: string) {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(el);
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 font-mono text-[11px] text-[#5B6661] transition-colors hover:text-[#1F6F4F]"
      title={reference}
    >
      <span className="max-w-[110px] overflow-hidden text-ellipsis whitespace-nowrap sm:max-w-[160px]">
        {reference}
      </span>
      {copied
        ? <CheckCheck className="h-3 w-3 shrink-0 text-[#1F6F4F]" />
        : <Copy className="h-3 w-3 shrink-0" />}
    </button>
  );
}

/* ─── Summary cards ────────────────────────────────────────────── */
function SummaryCards({
  summary,
  loading,
}: {
  summary: ReturnType<typeof useTransactionSummary>["data"];
  loading: boolean;
}) {
  // Guard against different backend key names
  const s = summary as any;
  const cards = [
    { label: "Total deposited",  value: s?.totalDeposited ?? s?.deposited ?? 0,           icon: ArrowDownToLine, green: true  },
    { label: "Total invested",   value: s?.totalInvested  ?? s?.invested  ?? 0,            icon: Wallet,          green: false },
    { label: "Total profit",     value: s?.totalProfit    ?? s?.profit    ?? 0,            icon: TrendingUp,      green: true  },
    { label: "Total withdrawn",  value: s?.totalWithdrawn ?? s?.withdrawn ?? 0,            icon: ArrowUpFromLine, green: false },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, green }) =>
        loading ? (
          <div key={label} className="h-28 animate-pulse rounded-xl border border-[#E5E0D4] bg-[#E5E0D4]/40" />
        ) : (
          <div key={label} className="rounded-xl border border-[#E5E0D4] bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#5B6661] sm:text-xs">{label}</p>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F4EE]">
                <Icon className="h-4 w-4 text-[#1F6F4F]" />
              </div>
            </div>
            <p className={`font-mono text-xl font-bold sm:text-2xl ${green ? "text-[#1F6F4F]" : "text-[#0E1A17]"}`}>
              {formatMoney(value)}
            </p>
          </div>
        ),
      )}
    </div>
  );
}

/* ─── Skeleton row ─────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center justify-between gap-4 border-b border-[#F1EDE2] px-5 py-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[#E5E0D4]" />
        <div className="space-y-2">
          <div className="h-3.5 w-28 rounded bg-[#E5E0D4]" />
          <div className="h-2.5 w-20 rounded bg-[#E5E0D4]" />
        </div>
      </div>
      <div className="h-3.5 w-16 rounded bg-[#E5E0D4]" />
    </div>
  );
}

/* ─── Transaction row ──────────────────────────────────────────── */
function TransactionRow({ tx }: { tx: Transaction }) {
  const config = TYPE_CONFIG[tx.type] ?? TYPE_CONFIG.adjustment;
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-3 border-b border-[#F1EDE2] px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0E1A17]">{config.label}</p>
          <p className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#5B6661]">
            {tx.description || fmtDate(tx.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start sm:gap-1.5">
        <p className={`font-mono text-sm font-bold sm:text-base ${config.color}`}>
          {config.sign}{formatMoney(tx.amount)}
        </p>
        <ReferenceCopy reference={tx.reference} />
      </div>

      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-1.5">
        <StatusBadge status={tx.status} />
        <p className="hidden text-xs text-[#5B6661] sm:block">{fmtDate(tx.createdAt)}</p>
      </div>
    </div>
  );
}

/* ─── Pagination page numbers — Safari-safe (no spread reduce) ── */
function buildPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= current - 1 && p <= current + 1)) {
      pages.push(p);
    }
  }
  // Insert ellipsis markers — iterate with index to check gaps
  const withGaps: (number | "ellipsis")[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0) {
      const prev = pages[i - 1] as number;
      const curr = pages[i] as number;
      if (typeof prev === "number" && typeof curr === "number" && curr - prev > 1) {
        withGaps.push("ellipsis");
      }
    }
    withGaps.push(pages[i]);
  }
  return withGaps;
}

/* ─── Type filter tabs ─────────────────────────────────────────── */
type FilterTab = "all" | TransactionType;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all",        label: "All"         },
  { key: "deposit",    label: "Deposits"    },
  { key: "withdrawal", label: "Withdrawals" },
  { key: "investment", label: "Investments" },
  { key: "profit",     label: "Profit"      },
];

/* ─── Main page ────────────────────────────────────────────────── */
export default function TransactionsPage() {
  const [tab,  setTab]  = useState<FilterTab>("all");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();
  const { data, isLoading } = useTransactions({
    page,
    limit: LIMIT,
    ...(tab !== "all" && { type: tab }),
  });

  const transactions = data?.data ?? [];
  const totalPages   = data?.meta?.totalPages ?? 1;

  function handleTabChange(t: FilterTab) {
    setTab(t);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Transactions</h1>
        <p className="mt-0.5 text-sm text-[#5B6661]">
          A complete record of every deposit, withdrawal, investment, and profit payout.
        </p>
      </div>

      <SummaryCards summary={summary} loading={summaryLoading} />

      <div className="rounded-xl border border-[#E5E0D4] bg-white">
        {/* Tab bar */}
        <div
          className="flex items-center gap-1 border-b border-[#E5E0D4] px-4 py-3"
          style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={[
                "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t.key
                  ? "bg-[#0E1A17] text-white"
                  : "text-[#5B6661] hover:bg-[#F7F4EE] hover:text-[#0E1A17]",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Rows */}
        <div>
          {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

          {!isLoading && transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F4EE]">
                <Receipt className="h-7 w-7 text-[#5B6661]" />
              </div>
              <p className="mt-4 font-display text-lg font-semibold text-[#0E1A17]">
                {tab === "all" ? "No transactions yet" : `No ${tab} transactions`}
              </p>
              <p className="mt-1 max-w-xs text-sm text-[#5B6661]">
                {tab === "all"
                  ? "Deposits, withdrawals, and investment activity will show up here."
                  : `You don't have any ${tab} transactions yet.`}
              </p>
            </div>
          )}

          {!isLoading && transactions.map((tx) => <TransactionRow key={tx._id} tx={tx} />)}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E0D4] px-5 py-4">
            <p className="text-xs text-[#5B6661]">
              Page {page} of {totalPages} · {data?.meta?.total ?? 0} transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D4] text-[#5B6661] transition-colors hover:border-[#1F6F4F] hover:text-[#1F6F4F] disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {buildPageNumbers(page, totalPages).map((p, i) =>
                p === "ellipsis" ? (
                  <span key={"e" + i} className="px-1 text-xs text-[#5B6661]">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      page === p
                        ? "bg-[#0E1A17] text-white"
                        : "border border-[#E5E0D4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F]",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ),
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
    </div>
  );
}
