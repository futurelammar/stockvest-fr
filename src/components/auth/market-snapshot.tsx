"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { useStocks } from "@/hooks/use-stocks";
import { Skeleton } from "@/components/ui/skeleton";
import type { Stock } from "@/types/stock";

function Sparkline({ up }: { up: boolean }) {
  // Fixed hex, not a theme token — this lives only on the always-dark brand panel.
  const color = up ? "#34d399" : "#f87171";
  const path = up
    ? "M0,20 C10,18 20,22 30,16 C40,10 50,14 60,8 C70,4 80,6 90,2"
    : "M0,4 C10,6 20,2 30,8 C40,14 50,10 60,16 C70,20 80,18 90,22";
  return (
    <svg viewBox="0 0 90 24" className="h-6 w-14" fill="none" aria-hidden="true">
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TickerRow({ stock }: { stock: Stock }) {
  const up = stock.changePercent >= 0;
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="w-14 font-mono text-sm font-semibold text-white">{stock.ticker}</span>
        <Sparkline up={up} />
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm text-white/70">
          $
          {stock.currentPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold ${
            up ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {up ? "+" : ""}
          {stock.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export function MarketSnapshot({ limit = 5 }: { limit?: number }) {
  // Fetch a wider pool than we show, since stocks not yet synced by the cron
  // sit at $0.00 and shouldn't be the first thing a visitor sees.
  const { data, isLoading, isError } = useStocks({ limit: 20 });
  const stocks = (data?.data ?? []).filter((s) => s.currentPrice > 0).slice(0, limit);

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Market snapshot</p>
      <div className="divide-y divide-white/[0.06] rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
        {isLoading &&
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <Skeleton className="h-4 w-14 bg-white/10" />
              <Skeleton className="h-4 w-24 bg-white/10" />
            </div>
          ))}

        {!isLoading && isError && <p className="px-4 py-4 text-xs text-white/40">Live prices unavailable right now.</p>}

        {!isLoading && !isError && stocks.length === 0 && (
          <p className="px-4 py-4 text-xs text-white/40">Prices syncing — check back shortly.</p>
        )}

        {!isLoading && stocks.map((stock) => <TickerRow key={stock._id} stock={stock} />)}
      </div>
    </div>
  );
}