"use client";

import { useState } from "react";
import { X, TrendingUp } from "lucide-react";
import type { AdminInvestment, CreditProfitPayload } from "@/hooks/use-admin-investments";

function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CreditProfitDialog({
  open,
  onClose,
  onConfirm,
  investment,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: CreditProfitPayload) => void;
  investment: AdminInvestment | null;
  loading: boolean;
}) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  if (!open || !investment) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0 || !reason.trim()) return;
    onConfirm({ amount: numericAmount, reason: reason.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#1F6F4F]" />
            <h2 className="font-display text-lg font-bold text-[#0E1A17]">Credit profit</h2>
          </div>
          <button onClick={onClose} className="text-[#5B6661] hover:text-[#0E1A17]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-1 text-xs text-[#5B6661]">
          {investment.plan?.planName ?? "Investment"} · {investment.user?.fullName} ·{" "}
          {investment.user?.email}
        </p>

        <div className="mt-3 rounded-lg bg-[#FAFAF7] px-3 py-2 text-xs text-[#5B6661]">
          Expected profit on this investment:{" "}
          <span className="font-mono font-medium text-[#1F6F4F]">
            {formatMoney(investment.expectedProfit)}
          </span>
          {investment.profitCredited && (
            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-[#1F6F4F]">
              Already credited once
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Amount to credit (USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={investment.expectedProfit.toFixed(2)}
              className="mt-1 w-full rounded-lg border border-[#E5E0D4] px-3 py-2 font-mono text-sm text-[#0E1A17] focus:border-[#1F6F4F] focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setAmount(String(investment.expectedProfit))}
              className="mt-1 text-[11px] font-semibold text-[#1F6F4F] hover:underline"
            >
              Use expected profit ({formatMoney(investment.expectedProfit)})
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Reason / note
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="e.g. Maturity profit payout"
              className="mt-1 w-full rounded-lg border border-[#E5E0D4] px-3 py-2 text-sm text-[#0E1A17] focus:border-[#1F6F4F] focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E5E0D4] px-4 py-2 text-sm font-semibold text-[#5B6661] hover:bg-[#F7F4EE]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#1F6F4F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#186040] disabled:opacity-50"
            >
              {loading ? "Crediting…" : "Credit profit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}