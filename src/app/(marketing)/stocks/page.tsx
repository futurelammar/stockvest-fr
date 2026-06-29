"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useStocks } from "@/hooks/use-stocks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { StockRow } from "@/components/stocks/stock-row";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function StocksPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isError } = useStocks({ search: debouncedSearch, limit: 50 });

  return (
    <div className="container py-12">
      <div className="mb-8 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-gold">Market board</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Stocks behind every plan</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Real tickers, synced from the market, alongside platform-curated names. Every investment plan is built
          on one of these.
        </p>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or ticker…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-border px-4 py-4 last:border-0">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}

        {isError && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Couldn&apos;t load stocks right now. Try again shortly.
          </p>
        )}

        {!isLoading && !isError && data?.data.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">No stocks match that search.</p>
        )}

        {!isLoading && data?.data.map((stock) => <StockRow key={stock._id} stock={stock} />)}
      </div>
    </div>
  );
}