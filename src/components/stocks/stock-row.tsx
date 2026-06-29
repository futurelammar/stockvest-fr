import { StockLogo } from "./stock-logo";
import { PriceChangeBadge } from "./price-change-badge";
import type { Stock } from "@/types/stock";

export function StockRow({ stock }: { stock: Stock }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-4 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <StockLogo logoUrl={stock.logoUrl} ticker={stock.ticker} size={36} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{stock.name}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {stock.ticker}
            {stock.isCustom && (
              <span className="ml-2 rounded bg-brand-gold/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-brand-gold">
                Platform
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="font-mono text-sm tabular-nums text-foreground">
          ${stock.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <PriceChangeBadge changePercent={stock.changePercent} />
      </div>
    </div>
  );
}