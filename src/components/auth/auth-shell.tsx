"use client";

import type { ReactNode } from "react";
import { useStocks } from "@/hooks/use-stocks";
import { usePlans } from "@/hooks/use-plans";

interface AuthShellProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
  const { data: stocksData, isLoading: stocksLoading } = useStocks({ limit: 20 });
  const { data: plansData } = usePlans({ limit: 1 });

  // Real tickers only — stocks not yet synced by the cron sit at $0.00 and
  // shouldn't show up here.
  const tickers = (stocksData?.data ?? [])
    .filter((s) => s.currentPrice > 0)
    .slice(0, 5)
    .map((s) => ({
      sym: s.ticker,
      price: s.currentPrice.toFixed(2),
      pct: (s.changePercent >= 0 ? "+" : "") + s.changePercent.toFixed(2),
      up: s.changePercent >= 0,
    }));

  const plansCount = plansData?.meta.total;

  return (
    // BUG FIX: this was `style={{ flexDirection: "row" }}` with no
    // responsive variant, forcing side-by-side panels on every screen size.
    // Layout direction now lives in className so it can actually respond.
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* ══════════════════════════════════════
          LEFT PANEL — dark forest green
      ══════════════════════════════════════ */}
      <div
        className="w-full flex-shrink-0 p-6 sm:p-10 lg:w-[52%] lg:px-14 lg:py-12"
        style={{
          background: "#0E1A17",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "-8rem",
            left: "-8rem",
            width: "24rem",
            height: "24rem",
            borderRadius: "50%",
            background: "rgba(52,211,153,0.18)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "20rem",
            height: "20rem",
            borderRadius: "50%",
            background: "rgba(16,90,55,0.40)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-display, serif)",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "#fff",
            }}
          >
            TorqBridge
            <span style={{ color: "#34d399" }}>.</span>
          </span>
        </div>

        <div
          className="gap-6 lg:gap-8"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            marginTop: "28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-flex",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#34d399",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#34d399",
              }}
            >
              {eyebrow}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display, serif)",
              fontSize: "clamp(26px, 4.5vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.18,
              color: "#fff",
              margin: 0,
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.48)",
              maxWidth: "320px",
              margin: 0,
            }}
          >
            {subtitle}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              {
                n: plansCount !== undefined ? `${plansCount} plan${plansCount === 1 ? "" : "s"}` : "Plans",
                d: "available",
              },
              { n: "By hand", d: "reviewed" },
            ].map((pill) => (
              <div
                key={pill.d}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#34d399" }}>{pill.n}</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)" }}>{pill.d}</span>
              </div>
            ))}
          </div>

          {/*
            Ticker strip — kept for lg+ only. On mobile this pushed the
            actual form far down the page before someone could log in;
            it's marketing texture, not something worth the scroll on a
            phone that opened this page to sign in.
          */}
          <div
            className="hidden lg:block"
            style={{
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.04)",
              overflow: "hidden",
            }}
          >
            {stocksLoading && (
              <div style={{ padding: "16px", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                Syncing live prices…
              </div>
            )}

            {!stocksLoading && tickers.length === 0 && (
              <div style={{ padding: "16px", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                Prices syncing — check back shortly.
              </div>
            )}

            {!stocksLoading &&
              tickers.map((t, i, arr) => (
                <div
                  key={t.sym}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#fff",
                      width: "48px",
                    }}
                  >
                    {t.sym}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
                      ${t.price}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: t.up ? "#34d399" : "#f87171",
                        minWidth: "64px",
                        textAlign: "right",
                      }}
                    >
                      {t.up ? "▲" : "▼"} {t.pct}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/*
          Bottom stats grid — also lg+ only, same reasoning as the ticker.
          Also fixed a pre-existing mismatch: grid was declared as 3
          columns but only ever rendered 2 items, leaving a dangling
          empty column. Now matches the actual item count.
        */}
        <div
          className="hidden lg:grid"
          style={{
            position: "relative",
            zIndex: 1,
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            paddingTop: "24px",
            marginTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          {[
            { label: "Plans", value: "Curated" },
            { label: "Reviewed", value: "By hand" },
          ].map((s) => (
            <div key={s.label}>
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                  margin: 0,
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  marginTop: "4px",
                  fontFamily: "var(--font-display, serif)",
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — form lives here
      ══════════════════════════════════════ */}
      <div
        className="px-5 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14"
        style={{
          flex: 1,
          background: "#F7F4EE",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "448px" }}>{children}</div>

        <p
          style={{
            marginTop: "auto",
            paddingTop: "40px",
            fontSize: "11px",
            color: "#B0AAA0",
            textAlign: "center",
          }}
        >
          © 2026 TorqBridge Capital. All rights reserved.
        </p>
      </div>
    </div>
  );
}