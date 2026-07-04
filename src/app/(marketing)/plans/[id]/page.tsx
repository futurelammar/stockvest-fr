"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, TrendingUp, Clock, Wallet, Shield,
  CheckCircle, ArrowRight, AlertCircle, X, Loader2,
  DollarSign, LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { StockLogo } from "@/components/stocks/stock-logo";
import { PriceChangeBadge } from "@/components/stocks/price-change-badge";
import { useCurrentUser } from "@/hooks/use-auth";
import {api} from "@/lib/api";
import type { InvestmentPlan } from "@/types/stock";

const INK     = "#0E1A17";
const EMERALD = "#1F6F4F";
const GOLD    = "#C9A24B";
const CREAM   = "#F7F4EE";
const MUTED   = "#A8B5A0";
const SLATE   = "#5B6661";

function fetchPlan(id: string) {
  return api.get<InvestmentPlan>(`/investment-plans/${id}`).then((r) => r.data);
}

function createInvestment(planId: string, amount: number) {
  return api.post("/investments", { planId, amount }).then((r) => r.data);
}

function Skeleton({ w = "w-full", h = "h-4" }: { w?: string; h?: string }) {
  return (
    <div className={`animate-pulse rounded-lg ${w} ${h}`}
      style={{ background: "rgba(31,111,79,0.1)" }} />
  );
}

// ─── Invest modal ─────────────────────────────────────────────────
function InvestModal({
  plan,
  userBalance,
  onClose,
}: {
  plan: InvestmentPlan;
  userBalance: number;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState(String(plan.minimumInvestment));
  const [done, setDone]     = useState(false);

  const num        = parseFloat(amount) || 0;
  const profit     = num * (plan.roiPercentage / 100);
  const total      = num + profit;
  const tooLow     = num < plan.minimumInvestment;
  const tooHigh    = num > plan.maximumInvestment;
  const noFunds    = num > userBalance;
  const hasError   = tooLow || tooHigh || noFunds;

  const invest = useMutation({
    mutationFn: () => createInvestment(plan._id, num),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["investments-mine"] });
      qc.invalidateQueries({ queryKey: ["user", "me"] });
      setDone(true);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Investment failed. Please try again.");
    },
  });

  // ── Success state ──
  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
        <div
          className="w-full max-w-md rounded-2xl border p-8 text-center"
          style={{ background: "#0E1A17", borderColor: "rgba(31,111,79,0.3)" }}
        >
          {/* Animated checkmark */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "rgba(31,111,79,0.15)", border: "2px solid rgba(31,111,79,0.4)" }}>
            <CheckCircle className="h-10 w-10" style={{ color: "#34d399" }} />
          </div>

          <h3 className="font-display text-2xl font-bold" style={{ color: CREAM }}>
            Investment confirmed!
          </h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
            You've invested{" "}
            <span className="font-mono font-bold" style={{ color: CREAM }}>
              ${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>{" "}
            in <strong style={{ color: CREAM }}>{plan.planName}</strong>.
          </p>

          {/* Summary */}
          <div
            className="my-6 rounded-xl border p-4 text-left space-y-2"
            style={{ background: "rgba(31,111,79,0.06)", borderColor: "rgba(31,111,79,0.18)" }}
          >
            {[
              { label: "Amount invested", value: `$${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: CREAM },
              { label: "Expected profit",  value: `+$${profit.toFixed(2)}`, color: "#34d399" },
              { label: "Total at maturity", value: `$${total.toFixed(2)}`, color: GOLD },
              { label: "Matures in",        value: `${plan.durationInDays} days`, color: MUTED },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: SLATE }}>{label}</span>
                <span className="font-mono text-sm font-semibold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all"
              style={{ background: EMERALD, color: CREAM }}
              onMouseEnter={e => (e.currentTarget.style.background = "#196040")}
              onMouseLeave={e => (e.currentTarget.style.background = EMERALD)}
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={onClose}
              className="w-full rounded-xl py-3 text-sm font-medium transition-colors"
              style={{ color: SLATE }}
              onMouseEnter={e => (e.currentTarget.style.color = CREAM)}
              onMouseLeave={e => (e.currentTarget.style.color = SLATE)}
            >
              Stay on this page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form state ──
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="w-full max-w-md rounded-2xl border"
        style={{ background: "#0E1A17", borderColor: "rgba(31,111,79,0.25)" }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between border-b p-5"
          style={{ borderColor: "rgba(31,111,79,0.15)" }}
        >
          <div>
            <h3 className="font-display text-lg font-bold" style={{ color: CREAM }}>
              Invest in {plan.planName}
            </h3>
            <p className="mt-0.5 text-xs" style={{ color: SLATE }}>
              {plan.roiPercentage}% ROI · {plan.durationInDays} days
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ color: SLATE }}
            onMouseEnter={e => (e.currentTarget.style.color = CREAM)}
            onMouseLeave={e => (e.currentTarget.style.color = SLATE)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Balance */}
          <div
            className="flex items-center justify-between rounded-xl border p-3"
            style={{ background: "rgba(31,111,79,0.06)", borderColor: "rgba(31,111,79,0.15)" }}
          >
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" style={{ color: "#34d399" }} />
              <span className="text-xs" style={{ color: SLATE }}>Your wallet balance</span>
            </div>
            <span className="font-mono text-sm font-bold" style={{ color: CREAM }}>
              ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Amount input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: SLATE }}>
                Investment amount
              </label>
              <div className="flex gap-1.5">
                {[plan.minimumInvestment, Math.min(plan.maximumInvestment, userBalance)].map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setAmount(String(v))}
                    className="rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors"
                    style={{ borderColor: "rgba(31,111,79,0.25)", color: "#34d399" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(31,111,79,0.1)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {i === 0 ? "Min" : "Max"}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-base"
                style={{ color: SLATE }}
              >$</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min={plan.minimumInvestment}
                max={plan.maximumInvestment}
                step="0.01"
                className="w-full rounded-xl border py-3.5 pl-8 pr-4 font-mono text-lg font-bold outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: hasError ? "rgba(168,57,47,0.5)" : "rgba(31,111,79,0.25)",
                  color: CREAM,
                }}
                onFocus={e => !hasError && (e.target.style.borderColor = "#1F6F4F")}
                onBlur={e  => !hasError && (e.target.style.borderColor = "rgba(31,111,79,0.25)")}
              />
            </div>

            {/* Validation messages */}
            {noFunds && (
              <p className="flex items-center gap-1.5 text-xs" style={{ color: "#A8392F" }}>
                <AlertCircle className="h-3.5 w-3.5" />
                Insufficient balance.{" "}
                <Link href="/deposit" className="underline" style={{ color: "#A8392F" }}>
                  Top up your wallet
                </Link>
              </p>
            )}
            {!noFunds && tooLow && (
              <p className="flex items-center gap-1.5 text-xs" style={{ color: "#A8392F" }}>
                <AlertCircle className="h-3.5 w-3.5" />
                Minimum investment is ${plan.minimumInvestment.toLocaleString()}
              </p>
            )}
            {!noFunds && tooHigh && (
              <p className="flex items-center gap-1.5 text-xs" style={{ color: "#A8392F" }}>
                <AlertCircle className="h-3.5 w-3.5" />
                Maximum investment is ${plan.maximumInvestment.toLocaleString()}
              </p>
            )}
            {!hasError && num > 0 && (
              <p className="text-xs" style={{ color: SLATE }}>
                Range: ${plan.minimumInvestment.toLocaleString()} – ${plan.maximumInvestment.toLocaleString()}
              </p>
            )}
          </div>

          {/* Return preview */}
          {num > 0 && !hasError && (
            <div
              className="rounded-xl border p-4 space-y-2"
              style={{ background: "rgba(31,111,79,0.06)", borderColor: "rgba(31,111,79,0.15)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: SLATE }}>
                Return preview
              </p>
              {[
                { label: "You invest",     value: `$${num.toFixed(2)}`,     color: CREAM },
                { label: "Profit",         value: `+$${profit.toFixed(2)}`, color: "#34d399" },
                { label: "You receive",    value: `$${total.toFixed(2)}`,   color: GOLD },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: SLATE }}>{label}</span>
                  <span className="font-mono text-sm font-bold" style={{ color }}>{value}</span>
                </div>
              ))}
              <div
                className="mt-1 border-t pt-2"
                style={{ borderColor: "rgba(31,111,79,0.15)" }}
              >
                <p className="text-center text-xs" style={{ color: SLATE }}>
                  After {plan.durationInDays} days · {plan.roiPercentage}% ROI
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={() => invest.mutate()}
            disabled={hasError || !num || invest.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: EMERALD, color: CREAM }}
            onMouseEnter={e => { if (!hasError && num && !invest.isPending) e.currentTarget.style.background = "#196040"; }}
            onMouseLeave={e => (e.currentTarget.style.background = EMERALD)}
          >
            {invest.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
            ) : (
              <><DollarSign className="h-4 w-4" /> Confirm Investment</>
            )}
          </button>

          <p className="text-center text-xs" style={{ color: SLATE }}>
            Amount will be deducted from your wallet immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── CTA button — auth-aware ──────────────────────────────────────
function InvestCTA({ plan }: { plan: InvestmentPlan }) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-14 w-full animate-pulse rounded-xl" style={{ background: "rgba(31,111,79,0.15)" }} />
    );
  }

  // Not logged in — prompt to register
  if (!user) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/register?redirect=/plans/${plan._id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold transition-all"
          style={{ background: EMERALD, color: CREAM }}
          onMouseEnter={e => (e.currentTarget.style.background = "#196040")}
          onMouseLeave={e => (e.currentTarget.style.background = EMERALD)}
        >
          Create account to invest <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={`/login?redirect=/plans/${plan._id}`}
          className="flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-all"
          style={{ borderColor: "rgba(31,111,79,0.3)", color: MUTED }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = EMERALD;
            e.currentTarget.style.color = "#34d399";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(31,111,79,0.3)";
            e.currentTarget.style.color = MUTED;
          }}
        >
          <LogIn className="h-4 w-4" /> Sign in
        </Link>
      </div>
    );
  }

  // Logged in — show invest button + modal
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => setModalOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold transition-all"
          style={{ background: EMERALD, color: CREAM }}
          onMouseEnter={e => (e.currentTarget.style.background = "#196040")}
          onMouseLeave={e => (e.currentTarget.style.background = EMERALD)}
        >
          <DollarSign className="h-5 w-5" /> Invest in this plan
        </button>
        <Link
          href="/plans"
          className="flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-all"
          style={{ borderColor: "rgba(31,111,79,0.3)", color: MUTED }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = EMERALD;
            e.currentTarget.style.color = "#34d399";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(31,111,79,0.3)";
            e.currentTarget.style.color = MUTED;
          }}
        >
          Browse other plans
        </Link>
      </div>

      {/* Balance warning if insufficient */}
     {(user?.balance ?? 0) < plan.minimumInvestment && (
        <div
          className="mt-3 flex items-center gap-2 rounded-xl border p-3 text-sm"
          style={{ background: "rgba(201,162,75,0.06)", borderColor: "rgba(201,162,75,0.2)", color: GOLD }}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          Your balance (${user?.balance?.toFixed(2) ?? "0.00"}) is below the minimum investment of ${plan.minimumInvestment.toLocaleString()}.{" "}
          <Link href="/deposit" className="underline font-medium">
            Deposit funds
          </Link>
        </div>
      )}

      {modalOpen && (
  <InvestModal
    plan={plan}
    userBalance={user?.balance ?? 0}  // ← add ?? 0
    onClose={() => setModalOpen(false)}
  />
)}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────
export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: plan, isLoading, isError } = useQuery({
    queryKey: ["plan", id],
    queryFn: () => fetchPlan(id),
    enabled: !!id,
  });

  return (
    <div style={{ background: INK, minHeight: "100vh" }}>

      {/* Back nav */}
      <div className="border-b" style={{ borderColor: "rgba(31,111,79,0.15)", background: "rgba(14,26,23,0.95)" }}>
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: MUTED }}
            onMouseEnter={e => (e.currentTarget.style.color = "#34d399")}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
          >
            <ArrowLeft className="h-4 w-4" /> Back to plans
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertCircle className="mb-3 h-10 w-10" style={{ color: "#A8392F" }} />
            <p className="text-lg font-semibold" style={{ color: CREAM }}>Plan not found</p>
            <p className="mt-1 text-sm" style={{ color: SLATE }}>
              This plan may have been removed or deactivated.
            </p>
            <Link href="/plans" className="mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold"
              style={{ background: EMERALD, color: CREAM }}>
              Browse all plans
            </Link>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-6">
            <Skeleton h="h-10" w="w-2/3" />
            <Skeleton h="h-5" />
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h="h-28" />)}
            </div>
          </div>
        )}

        {/* Content */}
        {plan && !isLoading && (
          <div className="space-y-8">

            {/* Stock header */}
            {plan.stock && (
              <div
                className="flex flex-col gap-4 overflow-hidden rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between"
                style={{ background: "rgba(31,111,79,0.06)", borderColor: "rgba(31,111,79,0.2)" }}
              >
                <div className="flex items-center gap-4">
                  <StockLogo logoUrl={plan.stock.logoUrl} ticker={plan.stock.ticker} size={56} />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest" style={{ color: SLATE }}>
                      {plan.stock.ticker}
                    </p>
                    <p className="mt-0.5 text-xl font-bold" style={{ color: CREAM }}>{plan.stock.name}</p>
                    <p className="mt-1 text-xs" style={{ color: SLATE }}>
                      {plan.stock.isCustom ? "Platform stock" : "Real market ticker"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  {plan.stock.currentPrice != null && (
                    <p className="font-mono text-2xl font-bold tabular-nums" style={{ color: CREAM }}>
                      ${plan.stock.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                  {plan.stock.changePercent != null && (
                    <PriceChangeBadge changePercent={plan.stock.changePercent} />
                  )}
                </div>
              </div>
            )}

            {/* Name + description */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold" style={{ color: CREAM }}>{plan.planName}</h1>
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                  style={{
                    background: plan.status === "active" ? "rgba(31,111,79,0.18)" : "rgba(91,102,97,0.18)",
                    color: plan.status === "active" ? "#34d399" : SLATE,
                  }}
                >
                  {plan.status}
                </span>
              </div>
              <p className="mt-3 text-base leading-relaxed" style={{ color: MUTED }}>{plan.description}</p>
              
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: TrendingUp, label: "Fixed ROI",         value: `${plan.roiPercentage}%`,     color: "#34d399", desc: "Guaranteed return at maturity" },
                { icon: Clock,      label: "Duration",          value: `${plan.durationInDays} days`, color: GOLD,      desc: "Time to maturity" },
                { icon: Wallet,     label: "Investment range",  value: `$${plan.minimumInvestment.toLocaleString()} – $${plan.maximumInvestment.toLocaleString()}`, color: CREAM, desc: "Min and max per investment" },
              ].map(({ icon: Icon, label, value, color, desc }) => (
                <div key={label} className="rounded-2xl border p-5"
                  style={{ background: "rgba(31,111,79,0.05)", borderColor: "rgba(31,111,79,0.15)" }}>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "rgba(31,111,79,0.12)", border: "1px solid rgba(31,111,79,0.2)" }}>
                    <Icon className="h-5 w-5" style={{ color: EMERALD }} />
                  </div>
                  <p className="text-xs uppercase tracking-wide" style={{ color: SLATE }}>{label}</p>
                  <p className="mt-1 font-mono text-xl font-bold" style={{ color }}>{value}</p>
                  <p className="mt-1 text-xs" style={{ color: SLATE }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Return projection */}
            {(() => {
              const example = plan.minimumInvestment * 2;
              const profit  = example * (plan.roiPercentage / 100);
              const total   = example + profit;
              return (
                <div className="rounded-2xl border p-6"
                  style={{ background: "rgba(31,111,79,0.06)", borderColor: "rgba(31,111,79,0.18)" }}>
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: SLATE }}>
                    Return projection — example
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "You invest",  value: `$${example.toLocaleString()}`,                                     color: CREAM },
                      { label: "Profit",      value: `+$${profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "#34d399" },
                      { label: "You receive", value: `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,   color: GOLD },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center">
                        <p className="text-xs" style={{ color: SLATE }}>{label}</p>
                        <p className="mt-1 font-mono text-xl font-bold tabular-nums" style={{ color }}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-center text-xs" style={{ color: SLATE }}>
                    After {plan.durationInDays} days · {plan.roiPercentage}% fixed ROI
                  </p>
                </div>
              );
            })()}

            {/* How it works */}
            <div className="rounded-2xl border p-6"
              style={{ background: "rgba(31,111,79,0.04)", borderColor: "rgba(31,111,79,0.12)" }}>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: SLATE }}>
                How this plan works
              </p>
              <div className="space-y-3">
                {[
                  "Fund your wallet with crypto (BTC, ETH, USDT, BNB)",
                  "Choose this plan and enter your investment amount",
                  `Wait ${plan.durationInDays} days for the plan to mature`,
                  `Your principal + ${plan.roiPercentage}% profit is credited to your wallet automatically`,
                  "Withdraw anytime after funds are credited",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: "rgba(31,111,79,0.2)", color: "#34d399" }}>
                      {i + 1}
                    </div>
                    <p className="text-sm" style={{ color: MUTED }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Shield,      text: "Fixed, platform-guaranteed returns" },
                { icon: CheckCircle, text: "No hidden fees or early exit penalties" },
                { icon: TrendingUp,  text: "Auto-credited on maturity date" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" style={{ color: "#34d399" }} />
                  <p className="text-xs" style={{ color: SLATE }}>{text}</p>
                </div>
              ))}
            </div>

            {/* Auth-aware CTA */}
            {plan.status === "active" ? (
              <InvestCTA plan={plan} />
            ) : (
              <div className="rounded-xl border p-4 text-center text-sm"
                style={{ background: "rgba(168,57,47,0.06)", borderColor: "rgba(168,57,47,0.2)", color: SLATE }}>
                This plan is currently inactive and not accepting new investments.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}