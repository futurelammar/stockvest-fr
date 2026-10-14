"use client";

import { useEffect, useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import type { UserTotals } from "@/hooks/use-admin-users";

type FieldKey = keyof UserTotals;

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "totalDeposited", label: "Total deposited" },
  { key: "totalInvested", label: "Total invested" },
  { key: "totalProfit", label: "Total profit" },
  { key: "totalWithdrawn", label: "Total withdrawn" },
];

interface EditTotalsDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (changes: Partial<UserTotals>, reason: string) => void;
  current?: UserTotals;
  loading: boolean;
}

function toInputValues(current?: UserTotals): Record<FieldKey, string> {
  return {
    totalDeposited: String(current?.totalDeposited ?? 0),
    totalInvested: String(current?.totalInvested ?? 0),
    totalProfit: String(current?.totalProfit ?? 0),
    totalWithdrawn: String(current?.totalWithdrawn ?? 0),
  };
}

export function EditTotalsDialog({ open, onClose, onConfirm, current, loading }: EditTotalsDialogProps) {
  const [values, setValues] = useState<Record<FieldKey, string>>(toInputValues(current));
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset the form each time the dialog opens, from the latest saved totals.
  useEffect(() => {
    if (open) {
      setValues(toInputValues(current));
      setReason("");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function handleSubmit() {
    setError(null);

    const changes: Partial<UserTotals> = {};
    for (const { key, label } of FIELDS) {
      const raw = values[key].trim();
      const n = Number(raw);
      if (raw === "" || !isFinite(n) || n < 0) {
        setError(`${label} must be a number of 0 or more.`);
        return;
      }
      const rounded = Math.round(n * 100) / 100;
      const saved = Math.round((current?.[key] ?? 0) * 100) / 100;
      if (rounded !== saved) changes[key] = rounded;
    }

    if (Object.keys(changes).length === 0) {
      setError("Change at least one total before saving.");
      return;
    }
    if (reason.trim().length < 3) {
      setError("Add a short reason for this change.");
      return;
    }

    onConfirm(changes, reason.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={loading ? undefined : onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#E5E0D4] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-[#0E1A17]">Edit user totals</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#F1EDE2] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-[#5B6661]" />
          </button>
        </div>
        <p className="mb-5 text-sm text-[#5B6661]">
          These figures appear on the user&apos;s dashboard and transactions page.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#5B6661]">
                {label}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#B0AAA0]">
                  $
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={values[key]}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  className="w-full rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-7 pr-3 font-mono text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#5B6661]">
            Reason for change
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="e.g. Corrected after offline deposit reconciliation"
            className="w-full resize-none rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          />
          <p className="mt-1 text-xs text-[#5B6661]">Saved in the server log with your admin ID.</p>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-[#A8392F]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[#D6D0C4] bg-white px-4 py-2.5 text-sm font-medium text-[#0E1A17] transition-colors hover:bg-[#F7F4EE] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#186040] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save totals
          </button>
        </div>
      </div>
    </div>
  );
}