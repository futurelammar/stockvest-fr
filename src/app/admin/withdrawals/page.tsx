"use client";

import { useState } from "react";
import {
  ArrowUpFromLine,
  Clock,
  CheckCircle2,
  XCircle,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Copy,
  CheckCheck,
} from "lucide-react";
import {
  useAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
  useMarkWithdrawalPaid,
} from "@/hooks/use-admin-withdrawals";
import type { AdminWithdrawal } from "@/hooks/use-admin-withdrawals";
import { ReviewDialog } from "@/components/admin/review-dialog";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";

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
  approved: { label: "Approved", icon: CheckCircle2,  bg: "bg-blue-50",    text: "text-blue-700"   },
  rejected: { label: "Rejected", icon: XCircle,       bg: "bg-rose-50",    text: "text-[#A8392F]"  },
  paid:     { label: "Paid",     icon: Banknote,      bg: "bg-emerald-50", text: "text-[#1F6F4F]"  },
};

type StatusTab = "all" | "pending" | "approved" | "rejected" | "paid";

const TABS: { key: StatusTab; label: string }[] = [
  { key: "all",      label: "All"      },
  { key: "pending",  label: "Pending"  },
  { key: "approved", label: "Approved" },
  { key: "paid",     label: "Paid"     },
  { key: "rejected", label: "Rejected" },
];

function CopyWallet({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 rounded-lg border border-[#D6D0C4] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0E1A17] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
      title={address}
    >
      {copied ? <CheckCheck className="h-3.5 w-3.5 text-[#1F6F4F]" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="max-w-[140px] truncate font-mono">{address}</span>
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

type ReviewState = { withdrawal: AdminWithdrawal; action: "approve" | "reject" } | null;

export default function AdminWithdrawalsPage() {
  const [tab, setTab] = useState<StatusTab>("pending");
  const [page, setPage] = useState(1);
  const [review, setReview] = useState<ReviewState>(null);
  const [markingPaid, setMarkingPaid] = useState<AdminWithdrawal | null>(null);

  const LIMIT = 15;

  const { data, isLoading } = useAdminWithdrawals({
    page,
    limit: LIMIT,
    status: tab !== "all" ? tab : undefined,
  });

  const approveWithdrawal = useApproveWithdrawal();
  const rejectWithdrawal = useRejectWithdrawal();
  const markPaid = useMarkWithdrawalPaid();

  const withdrawals = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  function handleReviewConfirm(adminNote?: string) {
    if (!review) return;
    if (review.action === "approve") {
      approveWithdrawal.mutate(review.withdrawal._id, {
        onSuccess: () => setReview(null),
      });
    } else {
      rejectWithdrawal.mutate(
        { id: review.withdrawal._id, adminNote },
        { onSuccess: () => setReview(null) },
      );
    }
  }

  const actionLoading =
    approveWithdrawal.isPending ||
    rejectWithdrawal.isPending ||
    markPaid.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Withdrawals</h1>
        <p className="mt-0.5 text-sm text-[#5B6661]">
          Review requests, approve payouts, and mark transfers as complete.
        </p>
      </div>

      {/* ── Workflow banner ── */}
      <div className="rounded-xl border border-[#E5E0D4] bg-white px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
          Approval workflow
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-[#5B6661]">
          <span className="rounded-full bg-amber-50 px-2 py-1 font-semibold text-amber-700">
            1 · Pending
          </span>
          <span>→</span>
          <span className="rounded-full bg-blue-50 px-2 py-1 font-semibold text-blue-700">
            2 · Approve
          </span>
          <span>→</span>
          <span className="rounded-full bg-[#F7F4EE] px-2 py-1 font-medium text-[#5B6661]">
            Send crypto off-platform
          </span>
          <span>→</span>
          <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-[#1F6F4F]">
            3 · Mark paid
          </span>
        </div>
      </div>

      {/* ── Pending callout ── */}
      {!isLoading && tab === "pending" && withdrawals.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <Clock className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-900">
            <span className="font-bold">{data?.meta.total}</span> withdrawal
            {data?.meta.total !== 1 ? "s" : ""} waiting for review. User
            balance{data?.meta.total !== 1 ? "s are" : " is"} already on hold.
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

        {!isLoading && withdrawals.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F4EE]">
              <ArrowUpFromLine className="h-7 w-7 text-[#5B6661]" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-[#0E1A17]">
              {tab === "pending" ? "No pending withdrawals" : `No ${tab} withdrawals`}
            </p>
            <p className="mt-1 text-sm text-[#5B6661]">
              {tab === "pending"
                ? "All caught up — no withdrawals waiting for review."
                : "Switch tabs to see other withdrawals."}
            </p>
          </div>
        )}

        {!isLoading && withdrawals.map((wd) => {
          const cfg = STATUS_CONFIG[wd.status];
          const Icon = cfg.icon;

          return (
            <div
              key={wd._id}
              className="border-b border-[#F1EDE2] px-5 py-4 last:border-0"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                {/* Left — user + meta */}
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0E1A17] text-[10px] font-bold text-emerald-400">
                      {wd.user?.fullName?.slice(0, 1).toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0E1A17]">
                        {wd.user?.fullName ?? "Unknown user"}
                      </p>
                      <p className="text-xs text-[#5B6661]">{wd.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5B6661]">
                    <span>
                      <span className="font-medium text-[#0E1A17]">{wd.coinType}</span>
                      {" · "}
                      {wd.network}
                    </span>
                    <span className="font-mono">{fmtDate(wd.createdAt)}</span>
                    {wd.paidAt && (
                      <span className="text-[#1F6F4F]">
                        Paid {fmtDate(wd.paidAt)}
                      </span>
                    )}
                    {wd.user && (
                      <span>
                        User balance:{" "}
                        <span className="font-mono font-medium text-[#0E1A17]">
                          {formatMoney(wd.user.balance)}
                        </span>
                      </span>
                    )}
                  </div>

                  {wd.adminNote && (
                    <p className="text-xs text-[#5B6661]">
                      <span className="font-medium text-[#0E1A17]">Note: </span>
                      {wd.adminNote}
                    </p>
                  )}
                </div>

                {/* Right — amount + status */}
                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <p className="font-mono text-lg font-bold text-[#A8392F]">
                    {formatMoney(wd.amount)}
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
                <CopyWallet address={wd.walletAddress} />

                {wd.status === "pending" && (
                  <>
                    <button
                      onClick={() => setReview({ withdrawal: wd, action: "approve" })}
                      className="flex items-center gap-1.5 rounded-lg bg-[#1F6F4F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#186040]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => setReview({ withdrawal: wd, action: "reject" })}
                      className="flex items-center gap-1.5 rounded-lg border border-[#A8392F]/30 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-[#A8392F] hover:bg-rose-100"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </>
                )}

                {wd.status === "approved" && (
                  <button
                    onClick={() => setMarkingPaid(wd)}
                    className="flex items-center gap-1.5 rounded-lg border border-[#1F6F4F]/40 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#1F6F4F] hover:bg-emerald-100"
                  >
                    <Banknote className="h-3.5 w-3.5" />
                    Mark as paid
                  </button>
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
            ? "Approve this withdrawal?"
            : "Reject this withdrawal?"
        }
        amount={review?.withdrawal.amount ?? 0}
        userName={review?.withdrawal.user?.fullName ?? ""}
        loading={actionLoading}
      />

      {/* Mark as paid confirm */}
      <ConfirmActionDialog
        open={!!markingPaid}
        onClose={() => setMarkingPaid(null)}
        onConfirm={() => {
          if (markingPaid) {
            markPaid.mutate(markingPaid._id, {
              onSuccess: () => setMarkingPaid(null),
            });
          }
        }}
        title="Mark as paid?"
        description={`Confirm you've sent ${markingPaid ? formatMoney(markingPaid.amount) : ""} in ${markingPaid?.coinType ?? ""} to the user's wallet. This updates the status to paid and creates a completed transaction record.`}
        confirmLabel="Yes, mark as paid"
        loading={markPaid.isPending}
      />
    </div>
  );
}