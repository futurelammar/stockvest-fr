"use client";

import { useState } from "react";
import {
  Wallet, Clock, CheckCircle2, XCircle, PauseCircle,
  PlayCircle, Ban, Calendar, ChevronLeft, ChevronRight,
  ChevronDown, TrendingUp, User,
} from "lucide-react";
import Image from "next/image";
import {
  useAdminInvestments,
  usePauseInvestment,
  useResumeInvestment,
  useCancelInvestment,
  useAdjustInvestmentDates,
} from "@/hooks/use-admin-investments";
import type { AdminInvestment, AdjustDatesPayload } from "@/hooks/use-admin-investments";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import { AdjustDatesDialog } from "@/components/admin/adjust-dates-dialog";

/* ─── helpers ─────────────────────────────────────────────────── */
function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
}

function daysLeft(maturityDate: string) {
  const diff = new Date(maturityDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function progressPercent(startDate: string, maturityDate: string) {
  const total = new Date(maturityDate).getTime() - new Date(startDate).getTime();
  const elapsed = Date.now() - new Date(startDate).getTime();
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

/* ─── status config ────────────────────────────────────────────── */
const STATUS_CONFIG = {
  active:    { label: "Active",    icon: Clock,        bg: "bg-emerald-50",  text: "text-[#1F6F4F]" },
  completed: { label: "Completed", icon: CheckCircle2, bg: "bg-blue-50",     text: "text-blue-700"  },
  cancelled: { label: "Cancelled", icon: XCircle,      bg: "bg-rose-50",     text: "text-[#A8392F]" },
  paused:    { label: "Paused",    icon: PauseCircle,  bg: "bg-amber-50",    text: "text-amber-700" },
};

/* ─── stock logo ───────────────────────────────────────────────── */
function StockLogoSmall({ logoUrl, ticker }: { logoUrl?: string; ticker: string }) {
  const COLORS = ["bg-[#1F6F4F]", "bg-[#C9A24B]", "bg-[#0E1A17]"];
  const bg = COLORS[ticker.charCodeAt(0) % COLORS.length];

  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={ticker}
        width={28}
        height={28}
        className="h-7 w-7 rounded-full border border-[#E5E0D4] object-cover"
      />
    );
  }
  return (
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold text-white ${bg}`}
    >
      {ticker.slice(0, 2)}
    </div>
  );
}

/* ─── skeleton row ─────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="animate-pulse space-y-2 border-b border-[#F1EDE2] px-5 py-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded-full bg-[#E5E0D4]" />
        <div className="h-4 w-32 rounded bg-[#E5E0D4]" />
        <div className="ml-auto h-4 w-16 rounded bg-[#E5E0D4]" />
      </div>
      <div className="h-3 w-48 rounded bg-[#E5E0D4]" />
    </div>
  );
}

/* ─── investment row ───────────────────────────────────────────── */
function InvestmentRow({
  inv,
  onPause,
  onResume,
  onCancel,
  onAdjustDates,
}: {
  inv: AdminInvestment;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onAdjustDates: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[inv.status];
  const Icon = cfg.icon;
  const stock = inv.plan?.stock;
  const remaining = daysLeft(inv.maturityDate);
  const progress = progressPercent(inv.startDate, inv.maturityDate);

  return (
    <div className="border-b border-[#F1EDE2] last:border-0">
      {/* Main row */}
      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          {stock ? (
            <StockLogoSmall logoUrl={stock.logoUrl} ticker={stock.ticker} />
          ) : (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7F4EE]">
              <Wallet className="h-3.5 w-3.5 text-[#5B6661]" />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-[#0E1A17]">
                {inv.plan?.planName ?? "—"}
              </p>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.text}`}
              >
                <Icon className="h-2.5 w-2.5" />
                {cfg.label}
              </span>
              {inv.status === "paused" && (
                <span className="text-[10px] text-amber-700">
                  ({Math.round((inv.pausedRemainingMs ?? 0) / 86400000)}d remaining at pause)
                </span>
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#5B6661]">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {inv.user?.fullName ?? "—"}
              </span>
              <span>{inv.user?.email}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
          <p className="font-mono font-bold text-[#0E1A17]">
            {formatMoney(inv.amountInvested)}
          </p>
          <p className="font-mono text-xs text-[#1F6F4F]">
            +{formatMoney(inv.expectedProfit)} expected
          </p>
        </div>
      </div>

      {/* Progress bar for active / paused */}
      {(inv.status === "active" || inv.status === "paused") && (
        <div className="px-5 pb-3">
          <div className="flex items-center justify-between text-xs text-[#5B6661] mb-1">
            <span>{fmtDate(inv.startDate)}</span>
            <span className={inv.status === "paused" ? "text-amber-700" : ""}>
              {inv.status === "paused" ? "Paused" : `${remaining}d left`}
            </span>
            <span>{fmtDate(inv.maturityDate)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1EDE2]">
            <div
              className={`h-full rounded-full transition-all ${
                inv.status === "paused" ? "bg-amber-400" : "bg-[#1F6F4F]"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between border-t border-[#F7F4EE] px-5 py-2 text-xs text-[#5B6661] hover:bg-[#FAFAF7]"
      >
        <span>
          {inv.roiPercentage}% ROI · {inv.durationInDays}d · created {fmtDate(inv.createdAt)}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expanded detail + actions */}
      {expanded && (
        <div className="border-t border-[#F7F4EE] bg-[#FAFAF7] px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div>
              <p className="text-[#5B6661] uppercase tracking-wide font-semibold">Start date</p>
              <p className="mt-0.5 font-mono text-[#0E1A17]">{fmtDate(inv.startDate)}</p>
            </div>
            <div>
              <p className="text-[#5B6661] uppercase tracking-wide font-semibold">Maturity</p>
              <p className="mt-0.5 font-mono text-[#0E1A17]">{fmtDate(inv.maturityDate)}</p>
            </div>
            <div>
              <p className="text-[#5B6661] uppercase tracking-wide font-semibold">Principal</p>
              <p className="mt-0.5 font-mono text-[#0E1A17]">{formatMoney(inv.amountInvested)}</p>
            </div>
            <div>
              <p className="text-[#5B6661] uppercase tracking-wide font-semibold">Profit</p>
              <p className="mt-0.5 font-mono text-[#1F6F4F]">{formatMoney(inv.expectedProfit)}</p>
            </div>
            {stock && (
              <div>
                <p className="text-[#5B6661] uppercase tracking-wide font-semibold">Stock</p>
                <p className="mt-0.5 font-mono text-[#0E1A17]">
                  {stock.ticker} · ${stock.currentPrice.toFixed(2)}
                </p>
              </div>
            )}
            <div>
              <p className="text-[#5B6661] uppercase tracking-wide font-semibold">Profit credited</p>
              <p className="mt-0.5 text-[#0E1A17]">{inv.profitCredited ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 border-t border-[#F1EDE2] pt-3">
            {inv.status === "active" && (
              <button
                onClick={onPause}
                className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                <PauseCircle className="h-3.5 w-3.5" />
                Pause
              </button>
            )}

            {inv.status === "paused" && (
              <button
                onClick={onResume}
                className="flex items-center gap-1.5 rounded-lg border border-[#1F6F4F]/30 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#1F6F4F] hover:bg-emerald-100"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                Resume
              </button>
            )}

            {(inv.status === "active" || inv.status === "paused") && (
              <button
                onClick={onCancel}
                className="flex items-center gap-1.5 rounded-lg border border-[#A8392F]/30 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-[#A8392F] hover:bg-rose-100"
              >
                <Ban className="h-3.5 w-3.5" />
                Cancel & refund
              </button>
            )}

            <button
              onClick={onAdjustDates}
              className="flex items-center gap-1.5 rounded-lg border border-[#D6D0C4] bg-white px-3 py-1.5 text-xs font-semibold text-[#0E1A17] hover:bg-[#F7F4EE]"
            >
              <Calendar className="h-3.5 w-3.5" />
              Adjust dates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── page ─────────────────────────────────────────────────────── */
type StatusFilter = "all" | "active" | "paused" | "completed" | "cancelled";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all",       label: "All"       },
  { key: "active",    label: "Active"    },
  { key: "paused",    label: "Paused"    },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

type DialogState =
  | { type: null }
  | { type: "pause";   inv: AdminInvestment }
  | { type: "resume";  inv: AdminInvestment }
  | { type: "cancel";  inv: AdminInvestment }
  | { type: "dates";   inv: AdminInvestment };

export default function AdminInvestmentsPage() {
  const [tab, setTab] = useState<StatusFilter>("active");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>({ type: null });
  const [adjustId, setAdjustId] = useState("");

  const LIMIT = 15;

  const { data, isLoading } = useAdminInvestments({
    page,
    limit: LIMIT,
    status: tab !== "all" ? tab : undefined,
  });

  const pause   = usePauseInvestment();
  const resume  = useResumeInvestment();
  const cancel  = useCancelInvestment();
  const adjust  = useAdjustInvestmentDates(adjustId);

  const investments = data?.data ?? [];
  const totalPages  = data?.meta.totalPages ?? 1;

  function closeDialog() {
    setDialog({ type: null });
  }

  const actionLoading =
    pause.isPending || resume.isPending || cancel.isPending || adjust.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Investments</h1>
        <p className="mt-0.5 text-sm text-[#5B6661]">
          View all user investments. Pause, resume, cancel, or adjust dates directly.
        </p>
      </div>

      {/* ── Table card ── */}
      <div className="rounded-xl border border-[#E5E0D4] bg-white">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-[#E5E0D4] px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setPage(1); }}
              className={`shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                tab === t.key
                  ? "bg-[#0E1A17] text-white"
                  : "text-[#5B6661] hover:bg-[#F7F4EE] hover:text-[#0E1A17]"
              }`}
            >
              {t.label}
            </button>
          ))}
          {data?.meta && (
            <span className="ml-auto flex items-center pl-2 text-xs text-[#5B6661]">
              {data.meta.total} total
            </span>
          )}
        </div>

        {/* Rows */}
        {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

        {!isLoading && investments.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F4EE]">
              <TrendingUp className="h-7 w-7 text-[#5B6661]" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-[#0E1A17]">
              No {tab === "all" ? "" : tab} investments
            </p>
            <p className="mt-1 text-sm text-[#5B6661]">
              {tab === "active"
                ? "No active investments right now."
                : "Switch tabs to view other investments."}
            </p>
          </div>
        )}

        {!isLoading &&
          investments.map((inv) => (
            <InvestmentRow
              key={inv._id}
              inv={inv}
              onPause={() => setDialog({ type: "pause", inv })}
              onResume={() => setDialog({ type: "resume", inv })}
              onCancel={() => setDialog({ type: "cancel", inv })}
              onAdjustDates={() => {
                setAdjustId(inv._id);
                setDialog({ type: "dates", inv });
              }}
            />
          ))}

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
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F] disabled:pointer-events-none disabled:opacity-40"
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
                  ),
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F] disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Dialogs ── */}
      <ConfirmActionDialog
        open={dialog.type === "pause"}
        onClose={closeDialog}
        onConfirm={() => {
          if (dialog.type === "pause") {
            pause.mutate(dialog.inv._id, { onSuccess: closeDialog });
          }
        }}
        title="Pause this investment?"
        description="The countdown to maturity will freeze. Remaining time is preserved and resumes when you reactivate it."
        confirmLabel="Pause"
        loading={pause.isPending}
      />

      <ConfirmActionDialog
        open={dialog.type === "resume"}
        onClose={closeDialog}
        onConfirm={() => {
          if (dialog.type === "resume") {
            resume.mutate(dialog.inv._id, { onSuccess: closeDialog });
          }
        }}
        title="Resume this investment?"
        description="The maturity date will be recalculated from now using the preserved remaining time."
        confirmLabel="Resume"
        loading={resume.isPending}
      />

      <ConfirmActionDialog
        open={dialog.type === "cancel"}
        onClose={closeDialog}
        onConfirm={() => {
          if (dialog.type === "cancel") {
            cancel.mutate(dialog.inv._id, { onSuccess: closeDialog });
          }
        }}
        title="Cancel this investment?"
        description={
          dialog.type === "cancel"
            ? `The principal of ${formatMoney(dialog.inv.amountInvested)} will be refunded immediately to the user's balance. Profit will not be paid. This cannot be undone.`
            : ""
        }
        confirmLabel="Cancel & refund principal"
        tone="danger"
        loading={cancel.isPending}
      />

      <AdjustDatesDialog
        open={dialog.type === "dates"}
        onClose={closeDialog}
        onConfirm={(payload: AdjustDatesPayload) => {
          adjust.mutate(payload, { onSuccess: closeDialog });
        }}
        investment={dialog.type === "dates" ? dialog.inv : null}
        loading={adjust.isPending}
      />
    </div>
  );
}