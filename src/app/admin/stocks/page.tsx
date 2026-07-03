"use client";

import { useState } from "react";
import {
  Plus, Search, ChevronDown, ChevronLeft, ChevronRight,
  RefreshCw, Pencil, Ban, BarChart3, ArrowUp, ArrowDown, Minus,
} from "lucide-react";
import Image from "next/image";
import { useAdminStocks, useCreateStock, useUpdateStock, useDisableStock } from "@/hooks/use-admin-stocks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { StockFormDialog } from "@/components/admin/stock-form-dialog";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import type { Stock } from "@/types/stock";
import type { StockFormPayload, UpdateCustomStockPayload } from "@/hooks/use-admin-stocks";

function fmtPrice(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function StockLogoCell({ stock }: { stock: Stock }) {
  const initials = stock.ticker.slice(0, 2);
  const COLORS = ["bg-[#1F6F4F]", "bg-[#C9A24B]", "bg-[#0E1A17]", "bg-[#5B6661]"];
  const bg = COLORS[initials.charCodeAt(0) % COLORS.length];

  if (stock.logoUrl) {
    return (
      <Image
        src={stock.logoUrl}
        alt={stock.ticker}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full border border-[#E5E0D4] object-cover"
      />
    );
  }

  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-white ${bg}`}
    >
      {initials}
    </div>
  );
}

function PriceCell({ stock }: { stock: Stock }) {
  const isUp = stock.changePercent > 0;
  const isFlat = stock.changePercent === 0;

  if (stock.currentPrice === 0) {
    return <span className="font-mono text-xs text-[#B0AAA0]">Pending sync…</span>;
  }

  return (
    <div className="space-y-0.5">
      <p className="font-mono text-sm font-semibold text-[#0E1A17]">
        ${fmtPrice(stock.currentPrice)}
      </p>
      <span
        className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
          isFlat
            ? "text-[#5B6661]"
            : isUp
            ? "text-[#1F6F4F]"
            : "text-[#A8392F]"
        }`}
      >
        {isFlat ? (
          <Minus className="h-2.5 w-2.5" />
        ) : isUp ? (
          <ArrowUp className="h-2.5 w-2.5" />
        ) : (
          <ArrowDown className="h-2.5 w-2.5" />
        )}
        {Math.abs(stock.changePercent).toFixed(2)}%
      </span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-4 border-b border-[#F1EDE2] px-5 py-4 last:border-0">
      <div className="h-8 w-8 rounded-full bg-[#E5E0D4]" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-28 rounded bg-[#E5E0D4]" />
        <div className="h-2.5 w-16 rounded bg-[#E5E0D4]" />
      </div>
      <div className="h-8 w-20 rounded bg-[#E5E0D4]" />
    </div>
  );
}

type TypeFilter = "all" | "real" | "custom";
type StatusFilter = "all" | "active" | "inactive";

export default function AdminStocksPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const [formOpen, setFormOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [disablingStock, setDisablingStock] = useState<Stock | null>(null);

  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, refetch, isFetching } = useAdminStocks({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    isCustom: typeFilter === "all" ? undefined : typeFilter === "custom",
  });

  const createStock = useCreateStock();
  const disableStock = useDisableStock();

  // Per-stock update hook needs the actual ID — we resolve it when the dialog confirms
  const [pendingUpdate, setPendingUpdate] = useState<{
    id: string;
    payload: UpdateCustomStockPayload;
  } | null>(null);
  const updateStockMutation = useUpdateStock(pendingUpdate?.id ?? "");

  const stocks = (data?.data ?? []).filter((s) =>
    statusFilter === "all" ? true : statusFilter === "active" ? s.status === "active" : s.status === "inactive",
  );
  const totalPages = data?.meta.totalPages ?? 1;

  function openCreate() {
    setEditingStock(null);
    setFormOpen(true);
  }

  function openEdit(stock: Stock) {
    setEditingStock(stock);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingStock(null);
  }

  function handleCreate(payload: StockFormPayload) {
    createStock.mutate(payload, { onSuccess: closeForm });
  }

  function handleUpdate(payload: UpdateCustomStockPayload) {
    if (!editingStock) return;
    setPendingUpdate({ id: editingStock._id, payload });
    updateStockMutation.mutate(payload, { onSuccess: closeForm });
  }

  const actionLoading =
    createStock.isPending ||
    updateStockMutation.isPending ||
    disableStock.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Stocks</h1>
          <p className="mt-0.5 text-sm text-[#5B6661]">
            Real tickers are synced from Finnhub every 15 minutes. Platform stocks are priced by you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D6D0C4] bg-white text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F] disabled:opacity-50"
            title="Force refresh prices"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#186040]"
          >
            <Plus className="h-4 w-4" /> Add stock
          </button>
        </div>
      </div>

      {/* ── Stats pills ── */}
      {data && (
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Total", value: data.meta.total },
            {
              label: "Real tickers",
              value: data.data.filter((s) => !s.isCustom).length,
            },
            {
              label: "Platform stocks",
              value: data.data.filter((s) => s.isCustom).length,
            },
            {
              label: "Pending sync",
              value: data.data.filter((s) => !s.isCustom && s.currentPrice === 0).length,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-[#E5E0D4] bg-white px-3 py-1.5 text-xs"
            >
              <span className="font-semibold text-[#0E1A17]">{value}</span>
              <span className="text-[#5B6661]">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0AAA0]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or ticker…"
            className="w-full rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          />
        </div>

        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as TypeFilter); setPage(1); }}
            className="appearance-none rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-3 pr-9 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          >
            <option value="all">All types</option>
            <option value="real">Real tickers</option>
            <option value="custom">Platform stocks</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0AAA0]" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="appearance-none rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-3 pr-9 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0AAA0]" />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-[#E5E0D4] bg-white">
        <div className="hidden grid-cols-[32px_1fr_80px_120px_120px_130px_100px] items-center gap-4 border-b border-[#F1EDE2] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#5B6661] lg:grid">
          <span />
          <span>Name / Ticker</span>
          <span>Type</span>
          <span>Sector</span>
          <span>Price</span>
          <span>Last synced</span>
          <span>Actions</span>
        </div>

        {isLoading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

        {!isLoading && stocks.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F4EE]">
              <BarChart3 className="h-7 w-7 text-[#5B6661]" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-[#0E1A17]">No stocks found</p>
            <p className="mt-1 max-w-xs text-sm text-[#5B6661]">
              Add your first stock or adjust the filters.
            </p>
          </div>
        )}

        {!isLoading && stocks.map((stock) => (
          <div
            key={stock._id}
            className={`grid grid-cols-1 gap-3 border-b border-[#F1EDE2] px-5 py-4 last:border-0 lg:grid-cols-[32px_1fr_80px_120px_120px_130px_100px] lg:items-center lg:gap-4 ${
              stock.status === "inactive" ? "opacity-55" : ""
            }`}
          >
            <StockLogoCell stock={stock} />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[#0E1A17]">{stock.name}</p>
                {stock.status === "inactive" && (
                  <span className="rounded-full bg-[#F7F4EE] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#5B6661]">
                    inactive
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-[#5B6661]">{stock.ticker}</p>
            </div>

            <div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  stock.isCustom
                    ? "bg-[#C9A24B]/15 text-[#9c7f3a]"
                    : "bg-[#1F6F4F]/10 text-[#1F6F4F]"
                }`}
              >
                {stock.isCustom ? "Platform" : "Real"}
              </span>
            </div>

            <p className="text-xs text-[#5B6661]">{stock.sector ?? "—"}</p>

            <PriceCell stock={stock} />

            <p className="text-xs text-[#5B6661]">
              {stock.isCustom ? "Manual" : fmtDate(stock.lastSyncedAt)}
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openEdit(stock)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D6D0C4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              {stock.status === "active" && (
                <button
                  onClick={() => setDisablingStock(stock)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#A8392F]/30 bg-rose-50 text-[#A8392F] hover:bg-rose-100"
                  title="Disable"
                >
                  <Ban className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* ── Pagination ── */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E0D4] px-5 py-4">
            <p className="text-xs text-[#5B6661]">
              Page {page} of {totalPages} · {data?.meta.total} stocks
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
                    <span key={`e-${i}`} className="px-1 text-xs text-[#5B6661]">…</span>
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
      </div>

      {/* ── Dialogs ── */}
      <StockFormDialog
        open={formOpen}
        onClose={closeForm}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={handleUpdate}
        editingStock={editingStock}
        loading={actionLoading}
      />

      <ConfirmActionDialog
        open={!!disablingStock}
        onClose={() => setDisablingStock(null)}
        onConfirm={() => {
          if (disablingStock) {
            disableStock.mutate(disablingStock._id, {
              onSuccess: () => setDisablingStock(null),
            });
          }
        }}
        title={`Disable ${disablingStock?.ticker}?`}
        description="This stock will be hidden from users. Any investment plans themed on it will also stop appearing publicly until re-enabled."
        confirmLabel="Disable"
        tone="danger"
        loading={disableStock.isPending}
      />
    </div>
  );
}