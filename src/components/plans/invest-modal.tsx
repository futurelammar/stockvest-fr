"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useMyInvestments } from "@/hooks/use-investments";
import type { InvestmentPlan } from "@/types/stock";

const INK = "#0E1A17";
const EMERALD = "#1F6F4F";
const GOLD = "#C9A24B";
const CREAM = "#F7F4EE";
const MUTED = "#A8B5A0";
const SLATE = "#5B6661";

interface InvestModalProps {
  plan: InvestmentPlan;
  userBalance?: number;
  onClose: () => void;
}

export function InvestModal({ plan, userBalance, onClose }: InvestModalProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<string>(String(plan.minimumInvestment));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createInvestment = useMyInvestments();

  const numericAmount = Number(amount);
  const isValidRange =
    !Number.isNaN(numericAmount) &&
    numericAmount >= plan.minimumInvestment &&
    numericAmount <= plan.maximumInvestment;
  const exceedsBalance = userBalance != null && numericAmount > userBalance;

  function handleSubmit() {
    setError(null);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (!isValidRange) {
      setError(
        `Amount must be between $${plan.minimumInvestment.toLocaleString()} and $${plan.maximumInvestment.toLocaleString()}.`,
      );
      return;
    }
    if (exceedsBalance) {
      setError("This amount is more than your available balance.");
      return;
    }

    createInvestment.mutate(
      { planId: plan._id, amount: numericAmount },
      {
        onSuccess: () => setSuccess(true),
        onError: (err: any) => {
          setError(err?.response?.data?.message || "Could not start this investment. Please try again.");
        },
      },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6"
        style={{ background: INK, borderColor: "rgba(31,111,79,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: SLATE }}>
            {success ? "Investment started" : `Invest in ${plan.planName}`}
          </p>
          <button onClick={onClose} style={{ color: SLATE }} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center py-4 text-center">
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "rgba(31,111,79,0.18)" }}
            >
              <CheckCircle2 className="h-7 w-7" style={{ color: "#34d399" }} />
            </div>
            <p className="text-lg font-bold" style={{ color: CREAM }}>
              You're in!
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
              ${numericAmount.toLocaleString()} is now invested in {plan.planName}. It matures in{" "}
              {plan.durationInDays} days, when your principal plus {plan.roiPercentage}% profit will be
              credited automatically.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 w-full rounded-xl py-3 text-sm font-bold"
              style={{ background: EMERALD, color: CREAM }}
            >
              Go to my dashboard
            </button>
          </div>
        ) : (
          <>
            <label className="mb-2 block text-xs" style={{ color: SLATE }}>
              Amount to invest (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={plan.minimumInvestment}
              max={plan.maximumInvestment}
              className="w-full rounded-xl border bg-transparent px-4 py-3 font-mono text-lg outline-none"
              style={{ borderColor: "rgba(31,111,79,0.3)", color: CREAM }}
              autoFocus
            />
            <p className="mt-2 text-xs" style={{ color: SLATE }}>
              Range: ${plan.minimumInvestment.toLocaleString()} – ${plan.maximumInvestment.toLocaleString()}
              {userBalance != null && <> · Your balance: ${userBalance.toLocaleString()}</>}
            </p>

            {error && (
              <div
                className="mt-3 flex items-start gap-2 rounded-lg border p-3 text-sm"
                style={{ borderColor: "rgba(168,57,47,0.3)", background: "rgba(168,57,47,0.08)", color: "#f87171" }}
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={createInvestment.isPending}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold transition-all disabled:opacity-60"
              style={{ background: EMERALD, color: CREAM }}
            >
              {createInvestment.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                </>
              ) : (
                "Confirm investment"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}