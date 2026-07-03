"use client";

import { useState } from "react";
import { Loader2, DollarSign } from "lucide-react";

interface AdjustBalanceDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (amount: number, reason: string) => void;
  currentBalance: number;
  loading?: boolean;
}

export function AdjustBalanceDialog({ open, onClose, onConfirm, currentBalance, loading }: AdjustBalanceDialogProps) {
  const [direction, setDirection] = useState<"credit" | "debit">("credit");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  if (!open) return null;

  const numAmount = parseFloat(amount) || 0;
  const signedAmount = direction === "credit" ? numAmount : -numAmount;
  const resultingBalance = currentBalance + signedAmount;
  const canSubmit = numAmount > 0 && reason.trim().length > 0 && resultingBalance >= 0;

  function handleConfirm() {
    onConfirm(signedAmount, reason.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7F4EE] text-[#1F6F4F]">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#0E1A17]">Adjust Balance</h3>
            <p className="mt-1 text-sm text-[#5B6661]">
              Current balance: <span className="font-mono font-semibold text-[#0E1A17]">${currentBalance.toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex gap-1 rounded-lg bg-[#F7F4EE] p-1">
            <button
              onClick={() => setDirection("credit")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                direction === "credit" ? "bg-[#1F6F4F] text-white" : "text-[#5B6661]"
              }`}
            >
              Credit (+)
            </button>
            <button
              onClick={() => setDirection("debit")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                direction === "debit" ? "bg-[#A8392F] text-white" : "text-[#5B6661]"
              }`}
            >
              Debit (-)
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-[#5B6661]">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-7 pr-3 font-mono text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
              />
            </div>
            {resultingBalance < 0 && (
              <p className="text-xs text-[#A8392F]">This would result in a negative balance.</p>
            )}
            {numAmount > 0 && resultingBalance >= 0 && (
              <p className="text-xs text-[#5B6661]">
                New balance:{" "}
                <span className="font-mono font-semibold text-[#0E1A17]">${resultingBalance.toLocaleString()}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Reason (required)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="e.g. Goodwill credit for delayed deposit approval"
              className="w-full rounded-lg border border-[#D6D0C4] bg-white p-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} disabled={loading} className="rounded-lg px-4 py-2 text-sm font-medium text-[#5B6661] hover:bg-[#F7F4EE]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canSubmit || loading}
            className="flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#186040] disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Apply Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}