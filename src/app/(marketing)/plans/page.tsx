"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { usePlans } from "@/hooks/use-plans";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { PlanCard } from "@/components/plans/plan-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlansPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isError } = usePlans({ search: debouncedSearch, limit: 24 });

  return (
    <div className="container py-12">
      <div className="mb-8 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-gold">Investment plans</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Curated plans, reviewed by hand</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Each plan is themed on a real or platform stock, with a fixed return and maturity date set by our team.
        </p>
      </div>

      <div className="relative mb-8 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search plans…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-xl border border-border p-5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Couldn&apos;t load investment plans right now. Try again shortly.
        </p>
      )}

      {!isLoading && !isError && data?.data.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">No plans match that search yet.</p>
      )}

      {!isLoading && data && data.data.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((plan) => (
            <PlanCard key={plan._id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}