"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  TrendingUp,
  Pencil,
  Ban,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useAdminPlans, useCreatePlan, useUpdatePlan, useDeactivatePlan } from "@/hooks/use-admin-plans";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { StockLogo } from "@/components/stocks/stock-logo";
import { PriceChangeBadge } from "@/components/stocks/price-change-badge";
import { PlanFormDialog } from "@/components/admin/plan-form-dialog";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import type { InvestmentPlan } from "@/types/stock";
import type { PlanFormPayload } from "@/hooks/use-admin-plans";

function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function SkeletonCard() {
  return <div className="h-56 animate-pulse rounded-xl border border-[#E5E0D4] bg-[#E5E0D4]/30" />;
}

type StatusFilter = "all" | "active" | "inactive";

export default function AdminPlansPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
  const [deactivatingPlan, setDeactivatingPlan] = useState<InvestmentPlan | null>(null);

  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading } = useAdminPlans({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan(editingPlan?._id ?? "");
  const deactivatePlan = useDeactivatePlan();

  const plans = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  function openCreate() {
    setEditingPlan(null);
    setFormOpen(true);
  }

  function openEdit(plan: InvestmentPlan) {
    setEditingPlan(plan);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingPlan(null);
  }

  function handleSubmit(payload: PlanFormPayload) {
    if (editingPlan) {
      updatePlan.mutate(payload, { onSuccess: closeForm });
    } else {
      createPlan.mutate(payload, { onSuccess: closeForm });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Investment Plans</h1>
          <p className="mt-0.5 text-sm text-[#5B6661]">Create and manage plans users can invest in.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#186040]"
        >
          <Plus className="h-4 w-4" /> New plan
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0AAA0]" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search plans…"
            className="w-full rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter);
              setPage(1);
            }}
            className="appearance-none rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-3 pr-9 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0AAA0]" />
        </div>
        {data?.meta && <span className="ml-auto text-xs text-[#5B6661] sm:ml-0">{data.meta.total} plans</span>}
      </div>

      {/* ── Grid ── */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!isLoading && plans.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E0D4] bg-white px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F4EE]">
            <Layers className="h-7 w-7 text-[#5B6661]" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-[#0E1A17]">No plans found</p>
          <p className="mt-1 max-w-xs text-sm text-[#5B6661]">Create your first investment plan to get started.</p>
        </div>
      )}

      {!isLoading && plans.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan._id} className="overflow-hidden rounded-xl border border-[#E5E0D4] bg-white">
              {/* AFTER — safe when plan.stock is undefined */}
                    <div className="flex items-center justify-between gap-3 border-b border-[#F1EDE2] bg-[#FAFAF7] px-4 py-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <StockLogo
                        logoUrl={plan.stock?.logoUrl}
                        ticker={plan.stock?.ticker ?? plan.planName?.slice(0, 4).toUpperCase()}
                        size={32}
                        />
                        <div className="min-w-0">
                        <p className="truncate font-mono text-xs uppercase tracking-wide text-[#5B6661]">
                            {plan.stock?.ticker ?? '—'}
                        </p>
                        </div>
                    </div>
                    {plan.stock?.changePercent != null && (
                        <PriceChangeBadge changePercent={plan.stock.changePercent} />
                    )}
                    </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-[#0E1A17]">{plan.planName}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      plan.status === "active" ? "bg-emerald-50 text-[#1F6F4F]" : "bg-[#F7F4EE] text-[#5B6661]"
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs text-[#5B6661]">{plan.description}</p>

                <div className="grid grid-cols-3 gap-2 rounded-lg bg-[#F7F4EE] p-3 font-mono">
                  <div>
                    <p className="text-[10px] uppercase text-[#5B6661]">ROI</p>
                    <p className="text-sm font-semibold text-[#1F6F4F]">{plan.roiPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#5B6661]">Duration</p>
                    <p className="text-sm font-semibold text-[#0E1A17]">{plan.durationInDays}d</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#5B6661]">Min</p>
                    <p className="text-sm font-semibold text-[#0E1A17]">{formatMoney(plan.minimumInvestment)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => openEdit(plan)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#D6D0C4] bg-white py-2 text-xs font-semibold text-[#0E1A17] hover:bg-[#F7F4EE]"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  {plan.status === "active" && (
                    <button
                      onClick={() => setDeactivatingPlan(plan)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#A8392F]/30 bg-rose-50 py-2 text-xs font-semibold text-[#A8392F] hover:bg-rose-100"
                    >
                      <Ban className="h-3.5 w-3.5" /> Deactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!isLoading && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E5E0D4] bg-white px-5 py-4">
          <p className="text-xs text-[#5B6661]">
            Page {page} of {totalPages} · {data?.meta.total} plans
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F] disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`e-${i}`} className="px-1 text-xs text-[#5B6661]">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? "bg-[#0E1A17] text-white"
                        : "border border-[#E5E0D4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F] disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Dialogs ── */}
      <PlanFormDialog
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        initialPlan={editingPlan}
        loading={createPlan.isPending || updatePlan.isPending}
      />

      <ConfirmActionDialog
        open={!!deactivatingPlan}
        onClose={() => setDeactivatingPlan(null)}
        onConfirm={() => {
          if (deactivatingPlan) {
            deactivatePlan.mutate(deactivatingPlan._id, { onSuccess: () => setDeactivatingPlan(null) });
          }
        }}
        title="Deactivate this plan?"
        description="Users will no longer be able to invest in it, but existing investments are unaffected."
        confirmLabel="Deactivate"
        tone="danger"
        loading={deactivatePlan.isPending}
      />
    </div>
  );
}