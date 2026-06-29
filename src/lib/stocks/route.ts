
import { NextResponse } from "next/server";

const FINNHUB_BASE = "https://finnhub.io/api/v1";
const API_KEY = process.env.FINNHUB_API_KEY ?? "";

// Symbols shown across auth pages
const SYMBOLS = ["NVDA", "AAPL", "TSLA", "MSFT", "META"];

export interface StockQuote {
  symbol: string;
  price: number;       // current price  (c)
  change: number;      // absolute change (d)
  changePct: number;   // percent change  (dp)
  prevClose: number;   // previous close  (pc)
  high: number;        // day high        (h)
  low: number;         // day low         (l)
  open: number;        // day open        (o)
}

async function fetchQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const res = await fetch(
      `${FINNHUB_BASE}/quote?symbol=${symbol}&token=${API_KEY}`,
      // Revalidate every 60 s — keeps the data fresh without hammering the free tier
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const d = await res.json();
    // Finnhub returns { c, d, dp, h, l, o, pc } — return null for bad tickers
    if (!d.c) return null;
    return {
      symbol,
      price: d.c,
      change: d.d,
      changePct: d.dp,
      prevClose: d.pc,
      high: d.h,
      low: d.l,
      open: d.o,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "FINNHUB_API_KEY is not set in environment variables." },
      { status: 500 }
    );
  }

  // Fetch all quotes in parallel
  const results = await Promise.all(SYMBOLS.map(fetchQuote));
  const quotes = results.filter(Boolean) as StockQuote[];

  return NextResponse.json({ quotes }, { status: 200 });
}