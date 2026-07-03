"use client";

import { useEffect, useState } from "react";
import { Loader2, X, Calendar } from "lucide-react";
import type { AdminInvestment, AdjustDatesPayload } from "@/hooks/use-admin-investments";

interface AdjustDatesDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: AdjustDatesPayload) => void;
  investment: AdminInvestment | null;
  loading?: boolean;
}

// Convert a UTC ISO string to a local datetime-local input value
function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdjustDatesDialog({
  open,
  onClose,
  onConfirm,
  investment,
  loading,
}: AdjustDatesDialogProps) {
  const [startDate, setStartDate] = useState("");
  const [maturityDate, setMaturityDate] = useState("");

  useEffect(() => {
    if (!open || !investment) return;
    setStartDate(toDatetimeLocal(investment.startDate));
    setMaturityDate(toDatetimeLocal(investment.maturityDate));
  }, [open, investment]);

  if (!open || !investment) return null;

  const maturityBeforeStart =
    startDate && maturityDate && new Date(maturityDate) <= new Date(startDate);

  const canSubmit = startDate && maturityDate && !maturityBeforeStart;

  function handleConfirm() {
    if (!canSubmit) return;
    onConfirm({
      startDate: new Date(startDate).toISOString(),
      maturityDate: new Date(maturityDate).toISOString(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7F4EE] text-[#1F6F4F]">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-[#0E1A17]">Adjust dates</h3>
            <p className="mt-0.5 text-sm text-[#5B6661]">
              {investment.plan?.planName ?? "Investment"} ·{" "}
              <span className="font-mono">
                ${investment.amountInvested.toLocaleString()}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[#F7F4EE]"
          >
            <X className="h-4 w-4 text-[#5B6661]" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Start date
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Maturity date
            </label>
            <input
              type="datetime-local"
              value={maturityDate}
              onChange={(e) => setMaturityDate(e.target.value)}
              className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
            />
            {maturityBeforeStart && (
              <p className="text-xs text-[#A8392F]">
                Maturity date must be after the start date.
              </p>
            )}
          </div>

          <div className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
            <p className="font-semibold">Use this to:</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5 text-amber-800/80">
              <li>Backdate an investment for testing</li>
              <li>Push the maturity date forward due to a platform issue</li>
              <li>Correct a date that was set incorrectly</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#5B6661] hover:bg-[#F7F4EE]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canSubmit || loading}
            className="flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#186040] disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update dates
          </button>
        </div>
      </div>
    </div>
  );
}