"use client";

import { useEffect, useState } from "react";
import { X, Pencil } from "lucide-react";
import type { AdminDeposit, EditDepositPayload } from "@/hooks/use-admin-deposits";

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditDepositDialog({
  open,
  onClose,
  onConfirm,
  deposit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: EditDepositPayload) => void;
  deposit: AdminDeposit | null;
  loading: boolean;
}) {
  const [amount, setAmount] = useState("");
  const [coinName, setCoinName] = useState("");
  const [network, setNetwork] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    if (deposit) {
      setAmount(String(deposit.amount));
      setCoinName(deposit.coinName);
      setNetwork(deposit.network);
      setCreatedAt(toLocalInputValue(deposit.createdAt));
    }
  }, [deposit]);

  if (!open || !deposit) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: EditDepositPayload = {};

    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount !== deposit!.amount) {
      payload.amount = numericAmount;
    }
    if (coinName !== deposit!.coinName) payload.coinName = coinName;
    if (network !== deposit!.network) payload.network = network;

    const newIso = new Date(createdAt).toISOString();
    if (newIso !== new Date(deposit!.createdAt).toISOString()) {
      payload.createdAt = newIso;
    }

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    onConfirm(payload);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pencil className="h-4 w-4 text-[#1F6F4F]" />
            <h2 className="font-display text-lg font-bold text-[#0E1A17]">Edit deposit</h2>
          </div>
          <button onClick={onClose} className="text-[#5B6661] hover:text-[#0E1A17]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-1 text-xs text-[#5B6661]">
          {deposit.user?.fullName ?? "Unknown user"} · {deposit.user?.email}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
            {deposit.status === "approved" && (
              <p className="mt-1 text-[11px] text-amber-700">
                Changing the amount on an approved deposit will adjust the user's balance by the difference.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
                Coin
              </label>
              <input
                type="text"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D4] px-3 py-2 text-sm text-[#0E1A17] focus:border-[#1F6F4F] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
                Network
              </label>
              <input
                type="text"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D4] px-3 py-2 text-sm text-[#0E1A17] focus:border-[#1F6F4F] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Date &amp; time (backdate or frontdate)
            </label>
            <input
              type="datetime-local"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E0D4] px-3 py-2 font-mono text-sm text-[#0E1A17] focus:border-[#1F6F4F] focus:outline-none"
              required
            />
            {deposit.status === "approved" && (
              <p className="mt-1 text-[11px] text-amber-700">
                This deposit is already approved — the linked transaction date will be updated too.
              </p>
            )}
          </div>

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
              disabled={loading}
              className="rounded-lg bg-[#1F6F4F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#186040] disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}