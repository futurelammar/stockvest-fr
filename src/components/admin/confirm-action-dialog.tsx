"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

interface ConfirmActionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: "danger" | "default";
  needsReason?: boolean;
  loading?: boolean;
}

export function ConfirmActionDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  tone = "default",
  needsReason = false,
  loading = false,
}: ConfirmActionDialogProps) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              tone === "danger" ? "bg-rose-50 text-[#A8392F]" : "bg-[#F7F4EE] text-[#1F6F4F]"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-[#0E1A17]">{title}</h3>
            <p className="mt-1 text-sm text-[#5B6661]">{description}</p>
          </div>
        </div>

        {needsReason && (
          <div className="mt-4 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Reason <span className="font-normal normal-case text-[#B0AAA0]">(optional but recommended)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Explain why for the audit trail and user notification…"
              className="w-full rounded-lg border border-[#D6D0C4] bg-white p-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#5B6661] hover:bg-[#F7F4EE]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(needsReason ? reason : undefined)}
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              tone === "danger" ? "bg-[#A8392F] hover:bg-[#8c2f27]" : "bg-[#1F6F4F] hover:bg-[#186040]"
            } disabled:opacity-60`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}