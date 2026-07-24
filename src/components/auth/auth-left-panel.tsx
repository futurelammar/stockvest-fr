// src/components/auth/auth-left-panel.tsx
// Dark branded left panel shared by login, register, and verify-email pages.
// Accepts a slot for page-specific content (ticker strip, portfolio cards, timeline).

"use client";

import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useStockQuotes, type StockQuote } from "@/hooks/use-stock-quotes";

/* ─── Sparkline (static decorative path per direction) ─── */
function Sparkline({ up }: { up: boolean }) {
  const color = up ? "#34d399" : "#f87171";
  const path = up
    ? "M0,20 C10,17 20,21 32,14 C44,8 56,12 68,6 C80,2 88,4 100,1"
    : "M0,3 C10,5 20,2 32,8 C44,14 56,10 68,16 C80,20 88,17 100,22";
  return (
    <svg viewBox="0 0 100 24" className="h-5 w-14" fill="none" aria-hidden="true">
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Single ticker row ─── */
function TickerRow({ quote }: { quote: StockQuote }) {
  const up = quote.change >= 0;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] last:border-0">
      <div className="flex items-center gap-3">
        <span className="w-14 font-mono text-[13px] font-bold text-white tracking-wide">
          {quote.symbol}
        </span>
        <Sparkline up={up} />
      </div>
      <div className="flex items-center gap-5">
        <span className="font-mono text-[13px] text-white/60">
          ${quote.price.toFixed(2)}
        </span>
        <span
          className={`flex items-center gap-0.5 text-[11px] font-bold min-w-[70px] justify-end ${
            up ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {up ? (
            <TrendingUp className="h-3 w-3 flex-shrink-0" />
          ) : (
            <TrendingDown className="h-3 w-3 flex-shrink-0" />
          )}
          {up ? "+" : ""}
          {quote.changePct.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

/* ─── Skeleton row while loading ─── */
function TickerSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] last:border-0">
      <div className="flex items-center gap-3">
        <div className="h-3 w-10 rounded bg-white/10 animate-pulse" />
        <div className="h-4 w-14 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-3 w-14 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-14 rounded bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

/* ─── Market snapshot panel (tickers) ─── */
export function MarketSnapshot() {
  const { quotes, loading, error, lastUpdated } = useStockQuotes();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
          Market snapshot
        </p>
        {lastUpdated && (
          <p className="flex items-center gap-1 text-[10px] text-white/25">
            <RefreshCw className="h-2.5 w-2.5" />
            {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>

      <div className="divide-y-0 rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
        {error ? (
          <p className="px-4 py-4 text-xs text-rose-400">{error}</p>
        ) : loading ? (
          Array.from({ length: 5 }).map((_, i) => <TickerSkeleton key={i} />)
        ) : quotes.length === 0 ? (
          <p className="px-4 py-4 text-xs text-white/30">No data available</p>
        ) : (
          quotes.map((q) => <TickerRow key={q.symbol} quote={q} />)
        )}
      </div>
    </div>
  );
}

/* ─── Portfolio cards (login page) ─── */
export function PortfolioStats({ quotes }: { quotes: StockQuote[] }) {
  // Derive a synthetic portfolio value from live prices (just for display)
  // In real usage you'd pull this from your own backend
  const totalValue =
    quotes.reduce((sum, q) => sum + q.price, 0) * 18; // mock qty multiplier

  const gainers = quotes.filter((q) => q.changePct > 0).length;

  const nextQuote = quotes[0]; // NVDA as featured position

  const stats = [
    {
      label: "Portfolio value",
      value: `$${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      sub: `${gainers}/${quotes.length} gainers today`,
      up: gainers > quotes.length / 2,
    },
    {
      label: "Active positions",
      value: "7",
      sub: "Across 4 plans",
      up: null,
    },
    {
      label: "Featured",
      value: nextQuote ? `${nextQuote.symbol}` : "—",
      sub: nextQuote
        ? `$${nextQuote.price.toFixed(2)} · ${nextQuote.changePct >= 0 ? "+" : ""}${nextQuote.changePct.toFixed(2)}%`
        : "—",
      up: nextQuote ? nextQuote.changePct >= 0 : null,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3"
        >
          <p className="text-[9px] font-semibold uppercase tracking-wider text-white/30 leading-tight">
            {s.label}
          </p>
          <p className="mt-1.5 font-mono text-sm font-bold text-white leading-tight">
            {s.value}
          </p>
          <p
            className={`mt-0.5 text-[10px] font-medium leading-tight ${
              s.up === true
                ? "text-emerald-400"
                : s.up === false
                ? "text-rose-400"
                : "text-white/30"
            }`}
          >
            {s.sub}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─── Left panel shell (logo + glow + grid) ─── */
export function AuthLeftPanel({
  eyebrow,
  headline,
  headlineAccent,
  subline,
  children,
}: {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative hidden lg:flex lg:w-[52%] flex-col justify-between overflow-hidden bg-[#0E1A17] px-14 py-12">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-900/40 blur-3xl" />

      {/* Logo */}
      <div className="relative z-10">
        <span className="font-display text-2xl font-bold tracking-tight text-white">
          Pitlane Markets<span className="text-emerald-400">.</span>
        </span>
      </div>

      {/* Middle */}
      <div className="relative z-10 space-y-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            {eyebrow}
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="font-display text-4xl font-bold leading-[1.15] text-white lg:text-[44px]">
            {headline}
            <br />
            <span className="text-emerald-400">{headlineAccent}</span>
          </h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-white/50">{subline}</p>
        </div>

        {children}
      </div>

      {/* Footer */}
      <div className="relative z-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
        {[
          { label: "Plans", value: "Curated" },
          { label: "Reviewed", value: "By hand" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">
              {s.label}
            </p>
            <p className="mt-1 font-display text-[15px] font-semibold text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}