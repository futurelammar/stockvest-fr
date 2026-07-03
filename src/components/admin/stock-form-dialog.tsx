"use client";

import { useEffect, useState } from "react";
import { X, ImageIcon, Loader2 } from "lucide-react";
import type { Stock } from "@/types/stock";
import type { StockFormPayload, UpdateCustomStockPayload } from "@/hooks/use-admin-stocks";

const SECTORS = [
  "Technology", "Financials", "Consumer Discretionary", "Consumer Staples",
  "Healthcare", "Industrials", "Automotive", "Media", "Retail", "Energy",
  "Real Estate", "Utilities", "Internal", "Other",
];

interface StockFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitCreate: (payload: StockFormPayload) => void;
  onSubmitUpdate: (payload: UpdateCustomStockPayload) => void;
  editingStock?: Stock | null;
  loading?: boolean;
}

export function StockFormDialog({
  open,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  editingStock,
  loading,
}: StockFormDialogProps) {
  const isEditing = !!editingStock;
  const isCustom = editingStock?.isCustom ?? true;
  const canEditPrice = !isEditing || isCustom;

  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [sector, setSector] = useState("Technology");
  const [stockType, setStockType] = useState<"real" | "custom">("real");
  const [currentPrice, setCurrentPrice] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editingStock) {
      setName(editingStock.name);
      setTicker(editingStock.ticker);
      setSector(editingStock.sector ?? "Technology");
      setStockType(editingStock.isCustom ? "custom" : "real");
      setCurrentPrice(editingStock.currentPrice ? String(editingStock.currentPrice) : "");
      setStatus(editingStock.status);
      setLogoPreview(editingStock.logoUrl ?? null);
    } else {
      setName("");
      setTicker("");
      setSector("Technology");
      setStockType("real");
      setCurrentPrice("");
      setStatus("active");
      setLogoPreview(null);
    }
    setLogoFile(null);
  }, [open, editingStock]);

  if (!open) return null;

  const effectiveIsCustom = isEditing ? isCustom : stockType === "custom";

  const canSubmit =
    name.trim() &&
    (isEditing || ticker.trim()) &&
    (!effectiveIsCustom || parseFloat(currentPrice) > 0);

  function handleLogoSelect(file: File) {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    if (isEditing) {
      onSubmitUpdate({
        name: name.trim(),
        sector,
        status,
        currentPrice: effectiveIsCustom && currentPrice ? parseFloat(currentPrice) : undefined,
        logoFile: logoFile ?? undefined,
      });
    } else {
      onSubmitCreate({
        name: name.trim(),
        ticker: ticker.trim().toUpperCase(),
        sector,
        isCustom: effectiveIsCustom,
        currentPrice: effectiveIsCustom && currentPrice ? parseFloat(currentPrice) : undefined,
        logoFile: logoFile ?? undefined,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E0D4] px-6 py-4">
          <h2 className="font-display text-lg font-bold text-[#0E1A17]">
            {isEditing ? `Edit ${editingStock.ticker}` : "Add Stock"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F7F4EE]"
          >
            <X className="h-4 w-4 text-[#5B6661]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Type toggle — only shown on create, locked on edit */}
          {!isEditing && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
                Stock type
              </label>
              <div className="flex gap-1 rounded-lg bg-[#F7F4EE] p-1">
                <button
                  type="button"
                  onClick={() => setStockType("real")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    stockType === "real" ? "bg-[#1F6F4F] text-white" : "text-[#5B6661]"
                  }`}
                >
                  Real ticker
                </button>
                <button
                  type="button"
                  onClick={() => setStockType("custom")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    stockType === "custom" ? "bg-[#C9A24B] text-[#0E1A17]" : "text-[#5B6661]"
                  }`}
                >
                  Platform stock
                </button>
              </div>
              <p className="text-xs text-[#5B6661]">
                {stockType === "real"
                  ? "Real ticker (e.g. AAPL) — price is synced automatically from Finnhub every 15 min."
                  : "Platform-created stock — you set and update the price manually."}
              </p>
            </div>
          )}

          {isEditing && (
            <div className="flex items-center gap-2 rounded-lg bg-[#F7F4EE] px-3 py-2.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  isCustom ? "bg-[#C9A24B]/20 text-[#9c7f3a]" : "bg-[#1F6F4F]/10 text-[#1F6F4F]"
                }`}
              >
                {isCustom ? "Platform stock" : "Real ticker"}
              </span>
              <span className="text-xs text-[#5B6661]">
                {isCustom
                  ? "Price is admin-controlled."
                  : "Price is synced automatically — cannot be edited directly."}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Company name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Apple Inc."
              className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
            />
          </div>

          {!isEditing && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
                Ticker symbol
              </label>
              <input
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="AAPL"
                maxLength={10}
                className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 font-mono text-sm uppercase text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
              />
              {!effectiveIsCustom && (
                <p className="text-xs text-[#5B6661]">
                  Must match the exact Finnhub ticker symbol — double check at{" "}
                  
                    <a
                      href="https://finnhub.io/docs/api/quote"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F6F4F] underline"
                    >
                      finnhub.io
                  </a>
                   Invalid tickers are silently skipped by the price cron.
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Sector
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {effectiveIsCustom && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
                {isEditing ? "Current price (update)" : "Starting price"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[#5B6661]">
                  $
                </span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-7 pr-3 font-mono text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
                />
              </div>
            </div>
          )}

          {isEditing && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
                Status
              </label>
              <div className="flex gap-1 rounded-lg bg-[#F7F4EE] p-1">
                <button
                  type="button"
                  onClick={() => setStatus("active")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    status === "active" ? "bg-[#1F6F4F] text-white" : "text-[#5B6661]"
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("inactive")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    status === "inactive" ? "bg-[#5B6661] text-white" : "text-[#5B6661]"
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Logo <span className="font-normal normal-case text-[#B0AAA0]">(optional)</span>
            </label>
            {logoPreview ? (
              <div className="relative flex items-center gap-3 rounded-lg border border-[#D6D0C4] p-3">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="flex-1 text-xs text-[#5B6661]">
                  {logoFile ? logoFile.name : "Existing logo"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLogoFile(null);
                    setLogoPreview(editingStock?.logoUrl ?? null);
                  }}
                  className="text-[#5B6661] hover:text-[#A8392F]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#D6D0C4] bg-[#FAFAF7] py-5 hover:border-[#1F6F4F]">
                <ImageIcon className="h-5 w-5 text-[#5B6661]" />
                <span className="text-xs text-[#5B6661]">Upload logo (PNG, JPG, WebP)</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoSelect(file);
                  }}
                />
              </label>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-[#F1EDE2] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#5B6661] hover:bg-[#F7F4EE]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#186040] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Save changes" : "Add stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}