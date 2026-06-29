// src/hooks/use-stock-quotes.ts
// Polls /api/stocks every 60 s and returns live Finnhub data.
// Falls back to null while loading or on error so pages can show skeletons.

"use client";

import { useEffect, useState, useCallback } from "react";

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  prevClose: number;
  high: number;
  low: number;
  open: number;
}

interface UseStockQuotesResult {
  quotes: StockQuote[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const POLL_INTERVAL_MS = 60_000; // 60 s — respects Finnhub free tier

export function useStockQuotes(): UseStockQuotesResult {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch("/api/stocks");
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setQuotes(data.quotes ?? []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Failed to load market data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    const id = setInterval(fetchQuotes, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchQuotes]);

  return { quotes, loading, error, lastUpdated };
}