import { StockLogo } from "./stock-logo";
import { PriceChangeBadge } from "./price-change-badge";
import type { Stock } from "@/types/stock";

export function StockRow({ stock }: { stock: Stock }) {
  return (
    <div
      className="group flex items-center justify-between gap-4 border-b px-5 py-4 last:border-0 transition-colors"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(31,111,79,0.06)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {/* Left — logo + name */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <StockLogo logoUrl={stock.logoUrl} ticker={stock.ticker} size={38} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold" style={{ color: "#F7F4EE" }}>
              {stock.name}
            </p>
            {stock.isCustom && (
              <span
                className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{ background: "rgba(201,162,75,0.15)", color: "#C9A24B" }}
              >
                Platform
              </span>
            )}
          </div>
          <p className="font-mono text-xs" style={{ color: "#5B6661" }}>
            {stock.ticker}
          </p>
        </div>
      </div>

      {/* Right — price + change */}
      <div className="flex shrink-0 items-center gap-4">
        <div className="text-right">
          <p className="font-mono text-base font-bold tabular-nums" style={{ color: "#F7F4EE" }}>
            ${stock.currentPrice != null
              ? stock.currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "—"}
          </p>
          <p className="text-xs" style={{ color: "#5B6661" }}>USD</p>
        </div>
        {stock.changePercent != null ? (
          <PriceChangeBadge changePercent={stock.changePercent} />
        ) : (
          <span
            className="rounded-full px-2.5 py-1 font-mono text-xs"
            style={{ background: "rgba(255,255,255,0.05)", color: "#5B6661" }}
          >
            —
          </span>
        )}
      </div>
    </div>
  );
}