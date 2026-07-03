import Link from "next/link";
import { TrendingUp, Clock, Wallet } from "lucide-react";
import { StockLogo } from "@/components/stocks/stock-logo";
import { PriceChangeBadge } from "@/components/stocks/price-change-badge";
import { Button } from "@/components/ui/button";
import type { InvestmentPlan } from "@/types/stock";

export function PlanCard({ plan }: { plan: InvestmentPlan }) {
  const stock = plan.stock;   // may be undefined if not populated

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">

      {/* Stock header — only shown when stock is populated */}
      {stock && (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-4">
          <div className="flex items-center gap-3">
            <StockLogo
              logoUrl={stock.logoUrl}
              ticker={stock.ticker}
              size={36}
            />
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                {stock.ticker}
              </p>
              <p className="text-sm font-medium text-foreground">{stock.name}</p>
            </div>
          </div>
          <div className="text-right">
            {stock.currentPrice != null && (
              <p className="font-mono text-sm tabular-nums text-foreground">
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

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-lg tracking-tight text-foreground">
            {plan.planName}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {plan.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/40 p-3 font-mono">
          <div>
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <TrendingUp className="h-3 w-3" /> ROI
            </div>
            <p className="mt-1 text-sm font-medium text-brand-emerald">
              {plan.roiPercentage}%
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3 w-3" /> Duration
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">
              {plan.durationInDays}d
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <Wallet className="h-3 w-3" /> Min
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">
              ${plan.minimumInvestment.toLocaleString()}
            </p>
          </div>
        </div>

       

        <Button asChild className="mt-auto w-full bg-brand-emerald hover:bg-brand-emerald/90">
          <Link href={`/plans/${plan._id}`}>View plan</Link>
        </Button>
      </div>
    </div>
  );
}