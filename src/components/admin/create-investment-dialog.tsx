"use client";

import { useEffect, useMemo, useState } from "react";
import { X, PlusCircle, Search } from "lucide-react";
import { useAdminUsersList } from "@/hooks/use-admin-users"; // adjust path to match your actual hook file
import { useAdminPlans } from "@/hooks/use-admin-plans";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { CreateInvestmentPayload } from "@/hooks/use-admin-investments";

export function CreateInvestmentDialog({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: CreateInvestmentPayload) => void;
  loading: boolean;
}) {
  const [userSearch, setUserSearch] = useState("");
  const debouncedSearch = useDebouncedValue(userSearch, 300);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserLabel, setSelectedUserLabel] = useState("");
  const [planId, setPlanId] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deductFromBalance, setDeductFromBalance] = useState(true);

  const { data: usersData, isLoading: usersLoading } = useAdminUsersList({
    search: debouncedSearch || undefined,
    limit: 8,
  });
  const { data: plansData } = useAdminPlans({ status: "active", limit: 100 });

  const selectedPlan = useMemo(
    () => plansData?.data.find((p) => p._id === planId),
    [plansData, planId],
  );

  useEffect(() => {
    if (!open) {
      setUserSearch("");
      setSelectedUserId("");
      setSelectedUserLabel("");
      setPlanId("");
      setAmount("");
      setStartDate("");
      setDeductFromBalance(true);
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserId || !planId || !amount) return;

    const payload: CreateInvestmentPayload = {
      userId: selectedUserId,
      planId,
      amount: parseFloat(amount),
      deductFromBalance,
    };
    if (startDate) payload.startDate = new Date(startDate).toISOString();

    onConfirm(payload);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-[#1F6F4F]" />
            <h2 className="font-display text-lg font-bold text-[#0E1A17]">New investment</h2>
          </div>
          <button onClick={onClose} className="text-[#5B6661] hover:text-[#0E1A17]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* User search */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              User
            </label>
            {selectedUserId ? (
              <div className="mt-1 flex items-center justify-between rounded-lg border border-[#1F6F4F]/30 bg-emerald-50 px-3 py-2 text-sm text-[#0E1A17]">
                <span>{selectedUserLabel}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUserId("");
                    setSelectedUserLabel("");
                  }}
                  className="text-xs font-semibold text-[#A8392F] hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative mt-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6661]" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full rounded-lg border border-[#E5E0D4] py-2 pl-9 pr-3 text-sm text-[#0E1A17] focus:border-[#1F6F4F] focus:outline-none"
                />
                {debouncedSearch && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-[#E5E0D4] bg-white shadow-sm">
                    {usersLoading && (
                      <p className="px-3 py-2 text-xs text-[#5B6661]">Searching…</p>
                    )}
                    {!usersLoading && usersData?.data.length === 0 && (
                      <p className="px-3 py-2 text-xs text-[#5B6661]">No users found.</p>
                    )}
                    {!usersLoading &&
                      usersData?.data.map((u) => (
                        <button
                          type="button"
                          key={u._id}
                          onClick={() => {
                            setSelectedUserId(u._id);
                            setSelectedUserLabel(`${u.fullName} · ${u.email}`);
                            setUserSearch("");
                          }}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F7F4EE]"
                        >
                          <p className="font-medium text-[#0E1A17]">{u.fullName}</p>
                          <p className="text-xs text-[#5B6661]">{u.email}</p>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Plan */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Plan
            </label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E0D4] px-3 py-2 text-sm text-[#0E1A17] focus:border-[#1F6F4F] focus:outline-none"
              required
            >
              <option value="">Select a plan…</option>
              {plansData?.data.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.planName} — {p.roiPercentage}% / {p.durationInDays}d
                </option>
              ))}
            </select>
            {selectedPlan && (
              <p className="mt-1 text-[11px] text-[#5B6661]">
                Range: ${selectedPlan.minimumInvestment.toLocaleString()} – $
                {selectedPlan.maximumInvestment.toLocaleString()}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Amount (USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E0D4] px-3 py-2 font-mono text-sm text-[#0E1A17] focus:border-[#1F6F4F] focus:outline-none"
              required
            />
          </div>

          {/* Optional backdated start */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Start date (optional — defaults to now)
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E0D4] px-3 py-2 font-mono text-sm text-[#0E1A17] focus:border-[#1F6F4F] focus:outline-none"
            />
          </div>

          {/* Deduct from balance toggle */}
          <label className="flex items-start gap-2 rounded-lg border border-[#E5E0D4] px-3 py-2.5">
            <input
              type="checkbox"
              checked={deductFromBalance}
              onChange={(e) => setDeductFromBalance(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#D6D0C4] text-[#1F6F4F] focus:ring-[#1F6F4F]"
            />
            <span className="text-xs text-[#5B6661]">
              <span className="font-semibold text-[#0E1A17]">Deduct from user balance.</span>{" "}
              Uncheck to create this investment without touching their balance (e.g. a bonus or gifted investment).
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E5E0D4] px-4 py-2 text-sm font-semibold text-[#5B6661] hover:bg-[#F7F4EE]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedUserId || !planId || !amount}
              className="rounded-lg bg-[#1F6F4F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#186040] disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create investment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}