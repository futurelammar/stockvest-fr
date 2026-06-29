import Link from "next/link";
import { TrendingUp, Clock, Wallet } from "lucide-react";
import { StockLogo } from "@/components/stocks/stock-logo";
import { PriceChangeBadge } from "@/components/stocks/price-change-badge";
import { Button } from "@/components/ui/button";
import type { InvestmentPlan } from "@/types/stock";

export function PlanCard({ plan }: { plan: InvestmentPlan }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <StockLogo logoUrl={plan.stock.logoUrl} ticker={plan.stock.ticker} size={36} />
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{plan.stock.ticker}</p>
            <p className="text-sm font-medium text-foreground">{plan.stock.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm tabular-nums text-foreground">
            $
            {plan.stock.currentPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <PriceChangeBadge changePercent={plan.stock.changePercent} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-lg tracking-tight text-foreground">{plan.planName}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{plan.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/40 p-3 font-mono">
          <div>
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <TrendingUp className="h-3 w-3" /> ROI
            </div>
            <p className="mt-1 text-sm font-medium text-brand-emerald">{plan.roiPercentage}%</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3 w-3" /> Duration
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">{plan.durationInDays}d</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <Wallet className="h-3 w-3" /> Min
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">${plan.minimumInvestment.toLocaleString()}</p>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Plan inspired by {plan.stock.ticker} · returns are platform-determined, not brokered
        </p>

        <Button asChild className="mt-auto w-full bg-brand-emerald hover:bg-brand-emerald/90">
          <Link href={`/plans/${plan._id}`}>View plan</Link>
        </Button>
      </div>
    </div>
  );
}