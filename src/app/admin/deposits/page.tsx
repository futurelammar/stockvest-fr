"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  CheckCheck,
} from "lucide-react";
import {
  useAdminDeposits,
  useApproveDeposit,
  useRejectDeposit,
} from "@/hooks/use-admin-deposits";
import type { AdminDeposit } from "@/hooks/use-admin-deposits";
import { ProofImageViewer } from "@/components/admin/proof-image-viewer";
import { ReviewDialog } from "@/components/admin/review-dialog";

function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const STATUS_CONFIG = {
  pending:  { label: "Pending",  icon: Clock,         bg: "bg-amber-50",   text: "text-amber-700"  },
  approved: { label: "Approved", icon: CheckCircle2,  bg: "bg-emerald-50", text: "text-[#1F6F4F]"  },
  rejected: { label: "Rejected", icon: XCircle,       bg: "bg-rose-50",    text: "text-[#A8392F]"  },
};

type StatusTab = "all" | "pending" | "approved" | "rejected";

const TABS: { key: StatusTab; label: string }[] = [
  { key: "all",      label: "All"      },
  { key: "pending",  label: "Pending"  },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

function CopyAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 font-mono text-xs text-[#5B6661] hover:text-[#1F6F4F]"
    >
      <span className="max-w-[140px] truncate">{value}</span>
      {copied ? <CheckCheck className="h-3 w-3 text-[#1F6F4F]" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse space-y-3 border-b border-[#F1EDE2] px-5 py-4 last:border-0">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-[#E5E0D4]" />
        <div className="h-4 w-16 rounded bg-[#E5E0D4]" />
      </div>
      <div className="h-3 w-48 rounded bg-[#E5E0D4]" />
    </div>
  );
}

type ReviewState = { deposit: AdminDeposit; action: "approve" | "reject" } | null;

export default function AdminDepositsPage() {
  const [tab, setTab] = useState<StatusTab>("pending");
  const [page, setPage] = useState(1);
  const [review, setReview] = useState<ReviewState>(null);

  const LIMIT = 15;

  const { data, isLoading } = useAdminDeposits({
    page,
    limit: LIMIT,
    status: tab !== "all" ? tab : undefined,
  });

  const approveDeposit = useApproveDeposit();
  const rejectDeposit = useRejectDeposit();

  const deposits = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  function handleReviewConfirm(adminNote?: string) {
    if (!review) return;
    if (review.action === "approve") {
      approveDeposit.mutate(review.deposit._id, { onSuccess: () => setReview(null) });
    } else {
      rejectDeposit.mutate(
        { id: review.deposit._id, adminNote },
        { onSuccess: () => setReview(null) },
      );
    }
  }

  const actionLoading = approveDeposit.isPending || rejectDeposit.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Deposits</h1>
        <p className="mt-0.5 text-sm text-[#5B6661]">
          Review proof of payment and credit user balances.
        </p>
      </div>

      {/* ── Pending callout ── */}
      {!isLoading && tab === "pending" && deposits.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <Clock className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-900">
            <span className="font-bold">{data?.meta.total}</span> deposit
            {data?.meta.total !== 1 ? "s" : ""} waiting for review.
          </p>
        </div>
      )}

      {/* ── Table card ── */}
      <div className="rounded-xl border border-[#E5E0D4] bg-white">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-[#E5E0D4] px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
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
        {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

        {!isLoading && deposits.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F4EE]">
              <ArrowDownToLine className="h-7 w-7 text-[#5B6661]" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-[#0E1A17]">
              {tab === "pending" ? "No pending deposits" : `No ${tab} deposits`}
            </p>
            <p className="mt-1 text-sm text-[#5B6661]">
              {tab === "pending"
                ? "All caught up — no deposits waiting for review."
                : "Switch tabs to see other deposits."}
            </p>
          </div>
        )}

        {!isLoading && deposits.map((dep) => {
          const cfg = STATUS_CONFIG[dep.status];
          const Icon = cfg.icon;

          return (
            <div
              key={dep._id}
              className="border-b border-[#F1EDE2] px-5 py-4 last:border-0"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                {/* Left — user + meta */}
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0E1A17] text-[10px] font-bold text-emerald-400">
                      {dep.user?.fullName?.slice(0, 1).toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0E1A17]">
                        {dep.user?.fullName ?? "Unknown user"}
                      </p>
                      <p className="text-xs text-[#5B6661]">{dep.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5B6661]">
                    <span>
                      <span className="font-medium text-[#0E1A17]">{dep.coinName}</span>
                      {" · "}
                      {dep.network}
                    </span>
                    <span className="font-mono">{fmtDate(dep.createdAt)}</span>
                    {dep.user && (
                      <span>
                        User balance:{" "}
                        <span className="font-mono font-medium text-[#0E1A17]">
                          {formatMoney(dep.user.balance)}
                        </span>
                      </span>
                    )}
                  </div>

                  {dep.adminNote && (
                    <p className="text-xs text-[#5B6661]">
                      <span className="font-medium text-[#0E1A17]">Note: </span>
                      {dep.adminNote}
                    </p>
                  )}
                </div>

                {/* Right — amount + status + actions */}
                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <p className="font-mono text-lg font-bold text-[#0E1A17]">
                    {formatMoney(dep.amount)}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}
                  >
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#F7F4EE] pt-3">
                <ProofImageViewer url={dep.proofOfPayment} />

                {dep.status === "pending" && (
                  <>
                    <button
                      onClick={() => setReview({ deposit: dep, action: "approve" })}
                      className="flex items-center gap-1.5 rounded-lg bg-[#1F6F4F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#186040]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => setReview({ deposit: dep, action: "reject" })}
                      className="flex items-center gap-1.5 rounded-lg border border-[#A8392F]/30 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-[#A8392F] hover:bg-rose-100"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </>
                )}

                {dep.wallet?.walletAddress && (
                  <CopyAddress value={dep.wallet.walletAddress} />
                )}
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E0D4] px-5 py-4">
            <p className="text-xs text-[#5B6661]">
              Page {page} of {totalPages}
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
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
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

      {/* Review dialog */}
      <ReviewDialog
        open={!!review}
        onClose={() => setReview(null)}
        onConfirm={handleReviewConfirm}
        action={review?.action ?? "approve"}
        label={
          review?.action === "approve"
            ? "Approve this deposit?"
            : "Reject this deposit?"
        }
        amount={review?.deposit.amount ?? 0}
        userName={review?.deposit.user?.fullName ?? ""}
        loading={actionLoading}
      />
    </div>
  );
}