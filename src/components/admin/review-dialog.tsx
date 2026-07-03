"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (adminNote?: string) => void;
  action: "approve" | "reject";
  label: string;
  amount: number;
  userName: string;
  loading?: boolean;
}

export function ReviewDialog({
  open,
  onClose,
  onConfirm,
  action,
  label,
  amount,
  userName,
  loading,
}: ReviewDialogProps) {
  const [adminNote, setAdminNote] = useState("");

  if (!open) return null;

  const isApprove = action === "approve";

  function handleConfirm() {
    onConfirm(adminNote.trim() || undefined);
    setAdminNote("");
  }

  function handleClose() {
    setAdminNote("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              isApprove ? "bg-emerald-50 text-[#1F6F4F]" : "bg-rose-50 text-[#A8392F]"
            }`}
          >
            {isApprove ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-[#0E1A17]">{label}</h3>
            <p className="mt-1 text-sm text-[#5B6661]">
              <span className="font-medium text-[#0E1A17]">{userName}</span> ·{" "}
              <span className="font-mono font-semibold">
                ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
            {isApprove ? "Note (optional)" : "Rejection reason (recommended)"}
          </label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            placeholder={
              isApprove
                ? "Any internal notes for this approval…"
                : "Explain why this was rejected — the user will see this message."
            }
            className="w-full rounded-lg border border-[#D6D0C4] bg-white p-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          />
        </div>

        {isApprove && (
          <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2.5 text-xs text-[#1F6F4F]">
            Balance will be credited immediately. This action cannot be undone.
          </div>
        )}
        {!isApprove && (
          <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2.5 text-xs text-[#A8392F]">
            The user will be notified by email with your reason.
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#5B6661] hover:bg-[#F7F4EE]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
              isApprove ? "bg-[#1F6F4F] hover:bg-[#186040]" : "bg-[#A8392F] hover:bg-[#8c2f27]"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isApprove ? "Confirm approval" : "Confirm rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}