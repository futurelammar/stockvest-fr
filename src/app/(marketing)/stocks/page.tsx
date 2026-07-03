"use client";

import { useState } from "react";
import { Search, BarChart3, TrendingUp, TrendingDown, RefreshCw, Globe, Cpu } from "lucide-react";
import { useStocks } from "@/hooks/use-stocks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { StockRow } from "@/components/stocks/stock-row";

function StockSkeleton() {
  return (
    <div
      className="flex animate-pulse items-center gap-4 border-b px-5 py-4 last:border-0"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="h-10 w-10 shrink-0 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-32 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-2.5 w-20 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
      <div className="text-right space-y-1.5">
        <div className="h-4 w-20 rounded ml-auto" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-3 w-10 rounded ml-auto" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
      <div className="h-6 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

export default function StocksPage() {
  const [search, setSearch]     = useState("");
  const debouncedSearch         = useDebouncedValue(search);

  const { data, isLoading, isError, refetch, isFetching } = useStocks({
    search: debouncedSearch || undefined,
    limit: 50,
  });

  const stocks   = data?.data ?? [];
  const gainers  = stocks.filter((s) => (s.changePercent ?? 0) > 0).length;
  const losers   = stocks.filter((s) => (s.changePercent ?? 0) < 0).length;

  return (
    <div style={{ background: "#0E1A17", minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="pointer-events-none absolute right-0 top-0 h-96 w-96"
          style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(31,111,79,0.12) 0%, transparent 70%)" }}
        />
        <div className="pointer-events-none absolute left-0 bottom-0 h-64 w-64"
          style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(201,162,75,0.06) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            {/* Left copy */}
            <div>
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
                style={{ borderColor: "rgba(201,162,75,0.3)", background: "rgba(201,162,75,0.07)", color: "#C9A24B" }}
              >
                <BarChart3 className="h-3.5 w-3.5" /> Market Board
              </div>
              <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: "#F7F4EE" }}>
                Stocks behind every plan
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "#A8B5A0" }}>
                Real tickers synced from the market every 15 minutes. Every investment plan
                on this platform is built on one of these stocks.
              </p>

              {/* Info chips */}
              <div className="mt-6 flex flex-wrap gap-4">
                {[
                  { icon: RefreshCw, text: "Prices sync every 15 min" },
                  { icon: Globe,     text: "Real US market tickers" },
                  { icon: Cpu,       text: "Platform stocks available too" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: "#34d399" }} />
                    <span className="text-xs" style={{ color: "#5B6661" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — market pulse card */}
            {!isLoading && stocks.length > 0 && (
              <div
                className="flex shrink-0 flex-wrap gap-6 rounded-2xl border p-5"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-2 self-start">
                  <div className="h-2 w-2 animate-pulse rounded-full" style={{ background: "#34d399" }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#5B6661" }}>Live</span>
                </div>
                <div className="flex gap-8">
                  <div>
                    <p className="font-mono text-2xl font-bold tabular-nums" style={{ color: "#34d399" }}>
                      {gainers}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: "#5B6661" }}>
                      <TrendingUp className="h-3 w-3" style={{ color: "#34d399" }} /> Gaining
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-bold tabular-nums" style={{ color: "#A8392F" }}>
                      {losers}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: "#5B6661" }}>
                      <TrendingDown className="h-3 w-3" style={{ color: "#A8392F" }} /> Declining
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-bold tabular-nums" style={{ color: "#F7F4EE" }}>
                      {stocks.length - gainers - losers}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: "#5B6661" }}>Flat</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search bar ───────────────────────────────────────── */}
      <div
        className="sticky top-16 z-30 border-b"
        style={{ background: "rgba(14,26,23,0.97)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#5B6661" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or ticker…"
                className="w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#F7F4EE" }}
                onFocus={e => (e.target.style.borderColor = "#1F6F4F")}
                onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all"
              style={{ borderColor: "rgba(255,255,255,0.08)", color: "#5B6661", background: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#34d399"; e.currentTarget.style.borderColor = "rgba(31,111,79,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#5B6661"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {!isLoading && (
              <span className="ml-auto text-xs" style={{ color: "#5B6661" }}>
                {stocks.length} stock{stocks.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="overflow-hidden rounded-2xl border"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          {/* Column headers */}
          <div
            className="hidden grid-cols-[1fr_180px_140px] items-center gap-4 border-b px-5 py-3 sm:grid"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#5B6661" }}>Stock</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: "#5B6661" }}>Price (USD)</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: "#5B6661" }}>24h Change</span>
          </div>

          {isLoading && Array.from({ length: 10 }).map((_, i) => <StockSkeleton key={i} />)}

          {isError && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BarChart3 className="mb-3 h-10 w-10" style={{ color: "#A8392F" }} />
              <p className="text-base font-semibold" style={{ color: "#F7F4EE" }}>Couldn&apos;t load stocks</p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-xl border px-4 py-2 text-sm font-medium"
                style={{ borderColor: "rgba(31,111,79,0.3)", color: "#34d399" }}
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && stocks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="mb-3 h-10 w-10" style={{ color: "#5B6661" }} />
              <p className="text-base font-semibold" style={{ color: "#F7F4EE" }}>No stocks found</p>
              <p className="mt-1 text-sm" style={{ color: "#5B6661" }}>
                {search ? `No results for "${search}"` : "No stocks available"}
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="mt-3 text-sm font-medium" style={{ color: "#34d399" }}>
                  Clear search
                </button>
              )}
            </div>
          )}

          {!isLoading && !isError && stocks.map((stock) => (
            <StockRow key={stock._id} stock={stock} />
          ))}
        </div>

        <p className="mt-4 text-center text-xs" style={{ color: "#3d4d49" }}>
          Prices for reference only. Investment returns are fixed and platform-determined, not linked to market movements.
        </p>
      </div>
    </div>
  );
}