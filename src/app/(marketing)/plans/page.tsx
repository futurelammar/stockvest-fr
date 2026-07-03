"use client";

import { useState } from "react";
import { Search, TrendingUp, Clock, Wallet, ArrowRight, SlidersHorizontal } from "lucide-react";
import { usePlans } from "@/hooks/use-plans";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { PlanCard } from "@/components/plans/plan-card";
import { cn } from "@/lib/utils";

// ─── Skeleton card ─────────────────────────────────────────────────
function PlanSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border animate-pulse"
      style={{ background: "rgba(31,111,79,0.04)", borderColor: "rgba(31,111,79,0.12)" }}
    >
      <div className="h-16 border-b" style={{ background: "rgba(31,111,79,0.06)", borderColor: "rgba(31,111,79,0.1)" }} />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="h-5 w-2/3 rounded-lg" style={{ background: "rgba(31,111,79,0.1)" }} />
        <div className="h-3 w-full rounded-lg" style={{ background: "rgba(31,111,79,0.07)" }} />
        <div className="h-3 w-4/5 rounded-lg" style={{ background: "rgba(31,111,79,0.07)" }} />
        <div className="mt-auto h-16 rounded-xl" style={{ background: "rgba(31,111,79,0.08)" }} />
        <div className="h-10 rounded-xl" style={{ background: "rgba(31,111,79,0.1)" }} />
      </div>
    </div>
  );
}

// ─── Filter pill ───────────────────────────────────────────────────
function FilterPill({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200"
      style={{
        background:   active ? "#1F6F4F"                  : "transparent",
        borderColor:  active ? "#1F6F4F"                  : "rgba(31,111,79,0.25)",
        color:        active ? "#F7F4EE"                  : "#5B6661",
      }}
    >
      {label}
    </button>
  );
}

const DURATION_FILTERS = [
  { label: "All durations", value: "" },
  { label: "≤ 30 days",     value: "short" },
  { label: "31–60 days",    value: "medium" },
  { label: "60+ days",      value: "long" },
];

const SORT_OPTIONS = [
  { label: "Newest first",  value: "newest" },
  { label: "Highest ROI",   value: "roi" },
  { label: "Lowest min.",   value: "min" },
];

export default function PlansPage() {
  const [search, setSearch]         = useState("");
  const [duration, setDuration]     = useState("");
  const [sort, setSort]             = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch             = useDebouncedValue(search);

  const { data, isLoading, isError } = usePlans({
    search: debouncedSearch || undefined,
    limit: 24,
  });

  const allPlans = data?.data ?? [];

  // Client-side filter & sort (avoids extra API params)
  const filtered = allPlans
    .filter((p) => {
      if (duration === "short")  return p.durationInDays <= 30;
      if (duration === "medium") return p.durationInDays > 30 && p.durationInDays <= 60;
      if (duration === "long")   return p.durationInDays > 60;
      return true;
    })
    .sort((a, b) => {
      if (sort === "roi") return b.roiPercentage - a.roiPercentage;
      if (sort === "min") return a.minimumInvestment - b.minimumInvestment;
      return 0; // newest = default API order
    });

  const totalPlans = filtered.length;

  return (
    <div style={{ background: "#0E1A17", minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0E1A17 0%, #071210 100%)",
          borderBottom: "1px solid rgba(31,111,79,0.18)",
        }}
      >
        {/* Glow blob */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: "600px", height: "300px",
            background: "radial-gradient(ellipse, rgba(31,111,79,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 text-center sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={{ borderColor: "rgba(201,162,75,0.3)", background: "rgba(201,162,75,0.07)", color: "#C9A24B" }}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Investment Plans
          </div>

          <h1
            className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl"
            style={{ color: "#F7F4EE" }}
          >
            Curated plans, reviewed by hand
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "#A8B5A0" }}>
            Each plan is themed on a real or platform stock, with a fixed return and maturity
            date set by our team. No speculation — just clear, structured growth.
          </p>

          {/* Stats row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { icon: TrendingUp, label: "Plans available", value: isLoading ? "—" : String(allPlans.length) },
              { icon: Clock,      label: "Avg duration",    value: "30–90 days" },
              { icon: Wallet,     label: "Min investment",  value: "$50" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: "rgba(31,111,79,0.15)", border: "1px solid rgba(31,111,79,0.25)" }}
                >
                  <Icon className="h-4 w-4" style={{ color: "#34d399" }} />
                </div>
                <div className="text-left">
                  <p className="font-mono text-base font-bold" style={{ color: "#F7F4EE" }}>{value}</p>
                  <p className="text-xs" style={{ color: "#5B6661" }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search + filters bar ─────────────────────────────── */}
      <div
        className="sticky top-16 z-30 border-b"
        style={{ background: "rgba(14,26,23,0.95)", backdropFilter: "blur(12px)", borderColor: "rgba(31,111,79,0.15)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: "#5B6661" }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plans…"
                className="w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none transition-all"
                style={{
                  background: "rgba(31,111,79,0.07)",
                  borderColor: "rgba(31,111,79,0.2)",
                  color: "#F7F4EE",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1F6F4F")}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(31,111,79,0.2)")}
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all"
              style={{
                background:   showFilters ? "rgba(31,111,79,0.15)" : "transparent",
                borderColor:  showFilters ? "#1F6F4F" : "rgba(31,111,79,0.2)",
                color:        showFilters ? "#34d399" : "#A8B5A0",
              }}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="hidden appearance-none rounded-xl border px-3 py-2.5 text-sm outline-none transition-all sm:block"
              style={{
                background:  "rgba(31,111,79,0.07)",
                borderColor: "rgba(31,111,79,0.2)",
                color:       "#A8B5A0",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "#0E1A17" }}>
                  {o.label}
                </option>
              ))}
            </select>

            {/* Result count */}
            {!isLoading && (
              <span className="ml-auto text-xs" style={{ color: "#5B6661" }}>
                {totalPlans} plan{totalPlans !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Expanded filter row */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 pb-3 pt-2">
              {DURATION_FILTERS.map((f) => (
                <FilterPill
                  key={f.value}
                  label={f.label}
                  active={duration === f.value}
                  onClick={() => setDuration(f.value)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Plan grid ────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <PlanSkeleton key={i} />)}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "rgba(168,57,47,0.1)", border: "1px solid rgba(168,57,47,0.2)" }}
            >
              <TrendingUp className="h-8 w-8" style={{ color: "#A8392F" }} />
            </div>
            <p className="text-base font-semibold" style={{ color: "#F7F4EE" }}>
              Couldn&apos;t load plans
            </p>
            <p className="mt-1 text-sm" style={{ color: "#5B6661" }}>
              Check your connection and try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "rgba(31,111,79,0.08)", border: "1px solid rgba(31,111,79,0.18)" }}
            >
              <Search className="h-8 w-8" style={{ color: "#5B6661" }} />
            </div>
            <p className="text-base font-semibold" style={{ color: "#F7F4EE" }}>No plans found</p>
            <p className="mt-1 text-sm" style={{ color: "#5B6661" }}>
              {search ? `No plans match "${search}".` : "No plans available right now."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-sm font-medium"
                style={{ color: "#34d399" }}
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((plan) => (
              <PlanCard key={plan._id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}