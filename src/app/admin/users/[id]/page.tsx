"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  ShieldOff,
  ShieldCheck,
  Lock,
  Unlock,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeCheck,
  ShieldAlert,
} from "lucide-react";
import {
  useAdminUser,
  useAdminUserInvestments,
  useAdminUserDeposits,
  useAdminUserWithdrawals,
  useBlockUser,
  useUnblockUser,
  useBlockWithdrawals,
  useUnblockWithdrawals,
  useAdjustBalance,
  useUpdateUserRole,
} from "@/hooks/use-admin-users";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import { AdjustBalanceDialog } from "@/components/admin/adjust-balance-dialog";

function formatMoney(n: number | undefined) {
  return `$${(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#E5E0D4] ${className}`} />;
}

type DialogState =
  | { type: null }
  | { type: "block" }
  | { type: "unblock" }
  | { type: "block-withdrawals" }
  | { type: "unblock-withdrawals" }
  | { type: "adjust-balance" }
  | { type: "change-role"; toRole: "admin" | "user" };

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [dialog, setDialog] = useState<DialogState>({ type: null });

  const { data: user, isLoading } = useAdminUser(userId);
  const { data: investments, isLoading: investmentsLoading } = useAdminUserInvestments(userId);
  const { data: deposits, isLoading: depositsLoading } = useAdminUserDeposits(userId);
  const { data: withdrawals, isLoading: withdrawalsLoading } = useAdminUserWithdrawals(userId);

  const blockUser = useBlockUser(userId);
  const unblockUser = useUnblockUser(userId);
  const blockWithdrawals = useBlockWithdrawals(userId);
  const unblockWithdrawals = useUnblockWithdrawals(userId);
  const adjustBalance = useAdjustBalance(userId);
  const updateRole = useUpdateUserRole(userId);

  function closeDialog() {
    setDialog({ type: null });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-40 w-full" />
        <div className="grid gap-4 sm:grid-cols-3">
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-24" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <p className="text-sm text-[#5B6661]">User not found.</p>;
  }

  const anyActionPending =
    blockUser.isPending ||
    unblockUser.isPending ||
    blockWithdrawals.isPending ||
    unblockWithdrawals.isPending ||
    adjustBalance.isPending ||
    updateRole.isPending;

  return (
    <div className="space-y-6">
      {/* ── Back + header ── */}
      <button
        onClick={() => router.push("/admin/users")}
        className="flex items-center gap-1.5 text-sm text-[#5B6661] hover:text-[#0E1A17]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to users
      </button>

      <div className="rounded-2xl border border-[#E5E0D4] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0E1A17] text-lg font-bold text-emerald-400">
              {user.fullName?.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold text-[#0E1A17]">{user.fullName}</h1>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    user.role === "admin" ? "bg-[#C9A24B]/15 text-[#C9A24B]" : "bg-[#F7F4EE] text-[#5B6661]"
                  }`}
                >
                  {user.role}
                </span>
                {!user.isActive && (
                  <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#A8392F]">
                    <ShieldOff className="h-3 w-3" /> Blocked
                  </span>
                )}
                {user.withdrawalsBlocked && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                    <Lock className="h-3 w-3" /> Withdrawals blocked
                  </span>
                )}
                {user.isEmailVerified ? (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-[#1F6F4F]">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-amber-700">
                    <ShieldAlert className="h-3 w-3" /> Unverified
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5B6661]">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {user.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Joined {fmtDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#0E1A17] px-5 py-3 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Balance</p>
            <p className="font-mono text-xl font-bold text-white">{formatMoney(user.balance)}</p>
          </div>
        </div>

        {(user.blockedReason || user.withdrawalsBlockedReason) && (
          <div className="mt-4 space-y-2">
            {user.blockedReason && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-[#A8392F]">
                <span className="font-semibold">Block reason: </span>
                {user.blockedReason}
              </div>
            )}
            {user.withdrawalsBlockedReason && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <span className="font-semibold">Withdrawal restriction reason: </span>
                {user.withdrawalsBlockedReason}
              </div>
            )}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#F1EDE2] pt-5">
          {user.isActive ? (
            <button
              onClick={() => setDialog({ type: "block" })}
              className="flex items-center gap-2 rounded-lg border border-[#A8392F]/30 bg-rose-50 px-3.5 py-2 text-sm font-medium text-[#A8392F] transition-colors hover:bg-rose-100"
            >
              <ShieldOff className="h-4 w-4" /> Block account
            </button>
          ) : (
            <button
              onClick={() => setDialog({ type: "unblock" })}
              className="flex items-center gap-2 rounded-lg border border-[#1F6F4F]/30 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-[#1F6F4F] transition-colors hover:bg-emerald-100"
            >
              <ShieldCheck className="h-4 w-4" /> Unblock account
            </button>
          )}

          {user.withdrawalsBlocked ? (
            <button
              onClick={() => setDialog({ type: "unblock-withdrawals" })}
              className="flex items-center gap-2 rounded-lg border border-[#1F6F4F]/30 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-[#1F6F4F] transition-colors hover:bg-emerald-100"
            >
              <Unlock className="h-4 w-4" /> Restore withdrawals
            </button>
          ) : (
            <button
              onClick={() => setDialog({ type: "block-withdrawals" })}
              className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100"
            >
              <Lock className="h-4 w-4" /> Block withdrawals
            </button>
          )}

          <button
            onClick={() => setDialog({ type: "adjust-balance" })}
            className="flex items-center gap-2 rounded-lg border border-[#D6D0C4] bg-white px-3.5 py-2 text-sm font-medium text-[#0E1A17] transition-colors hover:bg-[#F7F4EE]"
          >
            <DollarSign className="h-4 w-4" /> Adjust balance
          </button>

          {user.role === "user" ? (
            <button
              onClick={() => setDialog({ type: "change-role", toRole: "admin" })}
              className="flex items-center gap-2 rounded-lg border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-3.5 py-2 text-sm font-medium text-[#9c7f3a] transition-colors hover:bg-[#C9A24B]/20"
            >
              <ShieldCheck className="h-4 w-4" /> Promote to admin
            </button>
          ) : (
            <button
              onClick={() => setDialog({ type: "change-role", toRole: "user" })}
              className="flex items-center gap-2 rounded-lg border border-[#D6D0C4] bg-white px-3.5 py-2 text-sm font-medium text-[#0E1A17] transition-colors hover:bg-[#F7F4EE]"
            >
              <ShieldOff className="h-4 w-4" /> Demote to user
            </button>
          )}
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E5E0D4] bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-[#5B6661]">
            <Wallet className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">Total Invested</p>
          </div>
          <p className="font-mono text-xl font-bold text-[#0E1A17]">{formatMoney(user.totalInvested)}</p>
        </div>
        <div className="rounded-xl border border-[#E5E0D4] bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-[#5B6661]">
            <TrendingUp className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">Total Profit</p>
          </div>
          <p className="font-mono text-xl font-bold text-[#1F6F4F]">{formatMoney(user.totalProfit)}</p>
        </div>
        <div className="rounded-xl border border-[#E5E0D4] bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-[#5B6661]">
            <ArrowDownToLine className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">Deposits on file</p>
          </div>
          <p className="font-mono text-xl font-bold text-[#0E1A17]">{deposits?.data.length ?? 0}</p>
        </div>
      </div>

      {/* ── Investments ── */}
      <div className="rounded-xl border border-[#E5E0D4] bg-white">
        <div className="border-b border-[#E5E0D4] px-5 py-4">
          <h2 className="font-display text-base font-semibold text-[#0E1A17]">Investments</h2>
        </div>
        <div className="divide-y divide-[#F1EDE2]">
          {investmentsLoading && (
            <div className="px-5 py-4">
              <SkeletonBlock className="h-4 w-40" />
            </div>
          )}
          {!investmentsLoading && investments?.data.length === 0 && (
            <p className="px-5 py-6 text-center text-sm text-[#5B6661]">No investments yet.</p>
          )}
          {!investmentsLoading &&
            investments?.data.map((inv: any) => (
              <div key={inv._id} className="flex items-center justify-between px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#0E1A17]">{inv.plan?.planName ?? "—"}</p>
                  <p className="mt-0.5 text-xs capitalize text-[#5B6661]">{inv.status}</p>
                </div>
                <p className="font-mono text-sm font-medium text-[#0E1A17]">{formatMoney(inv.amountInvested)}</p>
              </div>
            ))}
        </div>
      </div>

      {/* ── Deposits + Withdrawals ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#E5E0D4] bg-white">
          <div className="border-b border-[#E5E0D4] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[#0E1A17]">Deposits</h2>
          </div>
          <div className="divide-y divide-[#F1EDE2]">
            {depositsLoading && (
              <div className="px-5 py-4">
                <SkeletonBlock className="h-4 w-40" />
              </div>
            )}
            {!depositsLoading && deposits?.data.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-[#5B6661]">No deposits yet.</p>
            )}
            {!depositsLoading &&
              deposits?.data.map((d: any) => (
                <div key={d._id} className="flex items-center justify-between px-5 py-3.5">
                  <p className="text-xs capitalize text-[#5B6661]">{d.status}</p>
                  <p className="font-mono text-sm font-medium text-[#1F6F4F]">{formatMoney(d.amount)}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E0D4] bg-white">
          <div className="border-b border-[#E5E0D4] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[#0E1A17]">Withdrawals</h2>
          </div>
          <div className="divide-y divide-[#F1EDE2]">
            {withdrawalsLoading && (
              <div className="px-5 py-4">
                <SkeletonBlock className="h-4 w-40" />
              </div>
            )}
            {!withdrawalsLoading && withdrawals?.data.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-[#5B6661]">No withdrawals yet.</p>
            )}
            {!withdrawalsLoading &&
              withdrawals?.data.map((w: any) => (
                <div key={w._id} className="flex items-center justify-between px-5 py-3.5">
                  <p className="text-xs capitalize text-[#5B6661]">{w.status}</p>
                  <p className="font-mono text-sm font-medium text-[#A8392F]">{formatMoney(w.amount)}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ── Dialogs ── */}
      <ConfirmActionDialog
        open={dialog.type === "block"}
        onClose={closeDialog}
        onConfirm={(reason) => blockUser.mutate({ reason }, { onSuccess: closeDialog })}
        title="Block this account?"
        description="The user will be immediately signed out and unable to log in until unblocked."
        confirmLabel="Block account"
        tone="danger"
        needsReason
        loading={blockUser.isPending}
      />

      <ConfirmActionDialog
        open={dialog.type === "unblock"}
        onClose={closeDialog}
        onConfirm={() => unblockUser.mutate(undefined, { onSuccess: closeDialog })}
        title="Unblock this account?"
        description="The user will regain full access immediately."
        confirmLabel="Unblock account"
        loading={unblockUser.isPending}
      />

      <ConfirmActionDialog
        open={dialog.type === "block-withdrawals"}
        onClose={closeDialog}
        onConfirm={(reason) => blockWithdrawals.mutate({ reason }, { onSuccess: closeDialog })}
        title="Block withdrawals for this user?"
        description="They'll keep full access to the platform but won't be able to submit new withdrawal requests."
        confirmLabel="Block withdrawals"
        tone="danger"
        needsReason
        loading={blockWithdrawals.isPending}
      />

      <ConfirmActionDialog
        open={dialog.type === "unblock-withdrawals"}
        onClose={closeDialog}
        onConfirm={() => unblockWithdrawals.mutate(undefined, { onSuccess: closeDialog })}
        title="Restore withdrawal access?"
        description="The user will be able to submit withdrawal requests again."
        confirmLabel="Restore access"
        loading={unblockWithdrawals.isPending}
      />

      <ConfirmActionDialog
        open={dialog.type === "change-role"}
        onClose={closeDialog}
        onConfirm={() => {
          if (dialog.type === "change-role") {
            updateRole.mutate({ role: dialog.toRole }, { onSuccess: closeDialog });
          }
        }}
        title={dialog.type === "change-role" && dialog.toRole === "admin" ? "Promote to admin?" : "Demote to regular user?"}
        description={
          dialog.type === "change-role" && dialog.toRole === "admin"
            ? "This user will gain full admin access, including the ability to manage other users."
            : "This user will lose admin access and be treated as a regular user."
        }
        confirmLabel={dialog.type === "change-role" && dialog.toRole === "admin" ? "Promote" : "Demote"}
        tone={dialog.type === "change-role" && dialog.toRole === "user" ? "danger" : "default"}
        loading={updateRole.isPending}
      />

      <AdjustBalanceDialog
        open={dialog.type === "adjust-balance"}
        onClose={closeDialog}
        onConfirm={(amount, reason) => adjustBalance.mutate({ amount, reason }, { onSuccess: closeDialog })}
        currentBalance={user.balance}
        loading={adjustBalance.isPending}
      />
    </div>
  );
}