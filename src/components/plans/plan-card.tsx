import Link from "next/link";
import { TrendingUp, Clock, Wallet, ArrowRight } from "lucide-react";
import { StockLogo } from "@/components/stocks/stock-logo";
import { PriceChangeBadge } from "@/components/stocks/price-change-badge";
import type { InvestmentPlan } from "@/types/stock";

export function PlanCard({ plan }: { plan: InvestmentPlan }) {
  const stock = plan.stock;

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(31,111,79,0.2)",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,162,75,0.35)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(31,111,79,0.2)")}
    >
      {/* ── Stock header ── */}
      {stock && (
        <div
          className="flex items-center justify-between gap-3 border-b px-4 py-3"
          style={{
            background: "rgba(14,26,23,0.8)",
            borderColor: "rgba(31,111,79,0.15)",
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <StockLogo logoUrl={stock.logoUrl} ticker={stock.ticker} size={32} />
            <div className="min-w-0">
              <p
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "#5B6661" }}
              >
                {stock.ticker}
              </p>
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "#F7F4EE" }}
              >
                {stock.name}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            {stock.currentPrice != null && (
              <p
                className="font-mono text-sm font-bold tabular-nums"
                style={{ color: "#F7F4EE" }}
              >
                ${stock.currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
            {stock.changePercent != null && (
              <PriceChangeBadge changePercent={stock.changePercent} />
            )}
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-4 p-5">

        {/* Plan name + ROI badge */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-display text-lg font-bold leading-snug"
            style={{ color: "#F7F4EE" }}
          >
            {plan.planName}
          </h3>
          <span
            className="shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold"
            style={{ background: "rgba(31,111,79,0.2)", color: "#34d399" }}
          >
            {plan.roiPercentage}%
          </span>
        </div>

        {/* Description */}
        <p
          className="line-clamp-2 text-sm leading-relaxed"
          style={{ color: "#A8B5A0" }}
        >
          {plan.description}
        </p>

        {/* Stats grid */}
        <div
          className="grid grid-cols-3 gap-3 rounded-xl border p-3"
          style={{
            background: "rgba(14,26,23,0.5)",
            borderColor: "rgba(31,111,79,0.15)",
          }}
        >
          {[
            { icon: TrendingUp, label: "ROI",      value: `${plan.roiPercentage}%`,         color: "#34d399" },
            { icon: Clock,      label: "Duration",  value: `${plan.durationInDays}d`,         color: "#F7F4EE" },
            { icon: Wallet,     label: "Min",       value: `$${plan.minimumInvestment.toLocaleString()}`, color: "#F7F4EE" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label}>
              <div
                className="flex items-center gap-1 text-[10px] uppercase tracking-wide mb-1"
                style={{ color: "#5B6661" }}
              >
                <Icon className="h-3 w-3" /> {label}
              </div>
              <p className="font-mono text-sm font-bold" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Stock disclaimer */}
        {stock?.ticker && (
          <p className="text-[10px] leading-relaxed" style={{ color: "rgba(91,102,97,0.8)" }}>
            Inspired by {stock.ticker} · returns are platform-determined, not brokered
          </p>
        )}

        {/* ── CTA button — always visible ── */}
        <Link
          href={`/plans/${plan._id}`}
          className="mt-auto flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 group/btn"
          style={{ background: "#1F6F4F", color: "#F7F4EE" }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#196040";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(31,111,79,0.4)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#1F6F4F";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          View Plan
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}