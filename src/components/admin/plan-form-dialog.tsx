"use client";

import { useEffect, useState } from "react";
import { Loader2, X, Upload, ImageIcon } from "lucide-react";
import { useAdminStocksForPicker } from "@/hooks/use-admin-plans";
import type { InvestmentPlan } from "@/types/stock";
import type { PlanFormPayload } from "@/hooks/use-admin-plans";

interface PlanFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: PlanFormPayload) => void;
  initialPlan?: InvestmentPlan | null;
  loading?: boolean;
}

const EMPTY_FORM = {
  planName: "",
  description: "",
  stockId: "",
  durationInDays: "",
  roiPercentage: "",
  minimumInvestment: "",
  maximumInvestment: "",
  status: "active" as "active" | "inactive",
};

export function PlanFormDialog({ open, onClose, onSubmit, initialPlan, loading }: PlanFormDialogProps) {
  const { data: stocks, isLoading: stocksLoading } = useAdminStocksForPicker();
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isEditing = !!initialPlan;

  useEffect(() => {
    if (!open) return;
    if (initialPlan) {
      setForm({
        planName: initialPlan.planName,
        description: initialPlan.description,
        stockId: initialPlan.stock._id,
        durationInDays: String(initialPlan.durationInDays),
        roiPercentage: String(initialPlan.roiPercentage),
        minimumInvestment: String(initialPlan.minimumInvestment),
        maximumInvestment: String(initialPlan.maximumInvestment),
        status: initialPlan.status,
      });
      setImagePreview(initialPlan.featuredImage ?? null);
    } else {
      setForm(EMPTY_FORM);
      setImagePreview(null);
    }
    setImageFile(null);
  }, [open, initialPlan]);

  if (!open) return null;

  function update<K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFileSelect(file: File) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  const minVal = parseFloat(form.minimumInvestment) || 0;
  const maxVal = parseFloat(form.maximumInvestment) || 0;
  const rangeInvalid = minVal > 0 && maxVal > 0 && minVal >= maxVal;

  const canSubmit =
    form.planName.trim() &&
    form.description.trim() &&
    form.stockId &&
    Number(form.durationInDays) > 0 &&
    Number(form.roiPercentage) >= 0 &&
    minVal > 0 &&
    maxVal > 0 &&
    !rangeInvalid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      planName: form.planName.trim(),
      description: form.description.trim(),
      stockId: form.stockId,
      durationInDays: Number(form.durationInDays),
      roiPercentage: Number(form.roiPercentage),
      minimumInvestment: minVal,
      maximumInvestment: maxVal,
      status: form.status,
      featuredImage: imageFile ?? undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E0D4] px-6 py-4">
          <h2 className="font-display text-lg font-bold text-[#0E1A17]">
            {isEditing ? "Edit Plan" : "Create Investment Plan"}
          </h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F7F4EE]">
            <X className="h-4 w-4 text-[#5B6661]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Plan name</label>
            <input
              value={form.planName}
              onChange={(e) => update("planName", e.target.value)}
              placeholder="Google Growth Plan"
              className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="A plan themed around steady tech-sector growth…"
              className="w-full rounded-lg border border-[#D6D0C4] bg-white p-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Themed stock</label>
            <select
              value={form.stockId}
              onChange={(e) => update("stockId", e.target.value)}
              disabled={stocksLoading}
              className="w-full appearance-none rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
            >
              <option value="">{stocksLoading ? "Loading stocks…" : "Select a stock"}</option>
              {stocks?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.ticker}) {s.isCustom ? "· Platform" : ""}
                </option>
              ))}
            </select>
            {!stocksLoading && stocks?.length === 0 && (
              <p className="text-xs text-amber-700">No active stocks available — create one first.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Duration (days)</label>
              <input
                type="number"
                min="1"
                value={form.durationInDays}
                onChange={(e) => update("durationInDays", e.target.value)}
                placeholder="30"
                className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">ROI (%)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.roiPercentage}
                onChange={(e) => update("roiPercentage", e.target.value)}
                placeholder="15"
                className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Min investment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5B6661]">$</span>
                <input
                  type="number"
                  min="1"
                  value={form.minimumInvestment}
                  onChange={(e) => update("minimumInvestment", e.target.value)}
                  placeholder="50"
                  className="w-full rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-7 pr-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Max investment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5B6661]">$</span>
                <input
                  type="number"
                  min="1"
                  value={form.maximumInvestment}
                  onChange={(e) => update("maximumInvestment", e.target.value)}
                  placeholder="5000"
                  className="w-full rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-7 pr-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
                />
              </div>
            </div>
          </div>
          {rangeInvalid && <p className="text-xs text-[#A8392F]">Maximum must be greater than minimum.</p>}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Status</label>
            <div className="flex gap-1 rounded-lg bg-[#F7F4EE] p-1">
              <button
                type="button"
                onClick={() => update("status", "active")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  form.status === "active" ? "bg-[#1F6F4F] text-white" : "text-[#5B6661]"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => update("status", "inactive")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  form.status === "inactive" ? "bg-[#5B6661] text-white" : "text-[#5B6661]"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Featured image</label>
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-lg border border-[#D6D0C4]">
                <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#D6D0C4] bg-[#FAFAF7] py-6 hover:border-[#1F6F4F]">
                <ImageIcon className="h-5 w-5 text-[#5B6661]" />
                <span className="text-xs text-[#5B6661]">Click to upload an image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
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
              {isEditing ? "Save changes" : "Create plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}