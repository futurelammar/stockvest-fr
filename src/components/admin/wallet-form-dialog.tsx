"use client";

import { useEffect, useState } from "react";
import { X, ImageIcon, QrCode, Loader2 } from "lucide-react";
import Image from "next/image";
import type { AdminWallet, WalletFormPayload, UpdateWalletPayload } from "@/hooks/use-admin-wallets";

const SUPPORTED_COINS = [
  { name: "Bitcoin", symbol: "BTC", networks: ["BTC"] },
  { name: "Ethereum", symbol: "ETH", networks: ["ERC20"] },
  { name: "Tether (USDT)", symbol: "USDT", networks: ["TRC20", "ERC20", "BEP20"] },
  { name: "BNB", symbol: "BNB", networks: ["BEP20"] },
  { name: "USD Coin", symbol: "USDC", networks: ["ERC20", "TRC20"] },
  { name: "Solana", symbol: "SOL", networks: ["SOL"] },
  { name: "Litecoin", symbol: "LTC", networks: ["LTC"] },
  { name: "Dogecoin", symbol: "DOGE", networks: ["DOGE"] },
  { name: "Ripple", symbol: "XRP", networks: ["XRP"] },
  { name: "Tron", symbol: "TRX", networks: ["TRC20"] },
];

interface WalletFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitCreate: (payload: WalletFormPayload) => void;
  onSubmitUpdate: (payload: UpdateWalletPayload) => void;
  editingWallet?: AdminWallet | null;
  loading?: boolean;
}

export function WalletFormDialog({
  open,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  editingWallet,
  loading,
}: WalletFormDialogProps) {
  const isEditing = !!editingWallet;

  const [coinName, setCoinName] = useState("");
  const [customCoin, setCustomCoin] = useState("");
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"active" | "disabled">("active");
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [useCustomCoin, setUseCustomCoin] = useState(false);

  const selectedCoin = SUPPORTED_COINS.find((c) => c.name === coinName);

  useEffect(() => {
    if (!open) return;
    if (editingWallet) {
      // Try matching the stored coinName to a preset
      const preset = SUPPORTED_COINS.find((c) => c.name === editingWallet.coinName);
      if (preset) {
        setUseCustomCoin(false);
        setCoinName(editingWallet.coinName);
      } else {
        setUseCustomCoin(true);
        setCustomCoin(editingWallet.coinName);
      }
      setNetwork(editingWallet.network);
      setAddress(editingWallet.walletAddress);
      setStatus(editingWallet.status);
      setQrPreview(editingWallet.qrCodeImage ?? null);
    } else {
      setCoinName("");
      setCustomCoin("");
      setNetwork("");
      setAddress("");
      setStatus("active");
      setQrPreview(null);
      setUseCustomCoin(false);
    }
    setQrFile(null);
  }, [open, editingWallet]);

  if (!open) return null;

  const resolvedCoinName = useCustomCoin ? customCoin.trim() : coinName;
  const canSubmit =
    resolvedCoinName &&
    network.trim() &&
    address.trim().length > 0;

  function handleQrSelect(file: File) {
    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      coinName: resolvedCoinName,
      network: network.trim(),
      walletAddress: address.trim(),
      qrCode: qrFile ?? undefined,
    };

    if (isEditing) {
      onSubmitUpdate({ ...payload, status });
    } else {
      onSubmitCreate(payload);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E0D4] px-6 py-4">
          <h2 className="font-display text-lg font-bold text-[#0E1A17]">
            {isEditing ? "Edit wallet" : "Add deposit wallet"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F7F4EE]"
          >
            <X className="h-4 w-4 text-[#5B6661]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Coin type toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Cryptocurrency
            </label>
            <div className="flex gap-1 rounded-lg bg-[#F7F4EE] p-1">
              <button
                type="button"
                onClick={() => { setUseCustomCoin(false); setCoinName(""); setNetwork(""); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  !useCustomCoin ? "bg-[#1F6F4F] text-white" : "text-[#5B6661]"
                }`}
              >
                Choose preset
              </button>
              <button
                type="button"
                onClick={() => { setUseCustomCoin(true); setCoinName(""); setNetwork(""); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  useCustomCoin ? "bg-[#C9A24B] text-[#0E1A17]" : "text-[#5B6661]"
                }`}
              >
                Custom coin
              </button>
            </div>

            {!useCustomCoin ? (
              <select
                value={coinName}
                onChange={(e) => { setCoinName(e.target.value); setNetwork(""); }}
                className="w-full appearance-none rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
              >
                <option value="">Select a coin</option>
                {SUPPORTED_COINS.map((c) => (
                  <option key={c.symbol} value={c.name}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={customCoin}
                onChange={(e) => setCustomCoin(e.target.value)}
                placeholder="e.g. Cardano (ADA)"
                className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
              />
            )}
          </div>

          {/* Network */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Network
            </label>
            {!useCustomCoin && selectedCoin ? (
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
              >
                <option value="">Select network</option>
                {selectedCoin.networks.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                placeholder="e.g. ADA, Cardano mainnet"
                className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
              />
            )}
          </div>

          {/* Wallet address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              Wallet address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Paste your full receiving wallet address here"
              className="w-full resize-none rounded-lg border border-[#D6D0C4] bg-white p-3 font-mono text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
            />
            <p className="text-xs text-[#5B6661]">
              Double-check this address. Users will send funds directly here.
            </p>
          </div>

          {/* Status — edit only */}
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
                  onClick={() => setStatus("disabled")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    status === "disabled" ? "bg-[#5B6661] text-white" : "text-[#5B6661]"
                  }`}
                >
                  Disabled
                </button>
              </div>
            </div>
          )}

          {/* QR code upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
              QR code image{" "}
              <span className="font-normal normal-case text-[#B0AAA0]">(optional but recommended)</span>
            </label>
            {qrPreview ? (
              <div className="relative flex items-center gap-3 rounded-lg border border-[#D6D0C4] p-3">
                <Image
                  src={qrPreview}
                  alt="QR code preview"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-lg border border-[#E5E0D4] object-contain"
                  unoptimized={!qrPreview.includes("cloudinary")}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0E1A17]">QR code set</p>
                  <p className="text-xs text-[#5B6661]">
                    {qrFile ? qrFile.name : "Existing QR code"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQrFile(null);
                    setQrPreview(editingWallet?.qrCodeImage ?? null);
                  }}
                  className="text-[#5B6661] hover:text-[#A8392F]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#D6D0C4] bg-[#FAFAF7] py-6 hover:border-[#1F6F4F]">
                <QrCode className="h-6 w-6 text-[#5B6661]" />
                <span className="text-xs text-[#5B6661]">
                  Upload QR code image (PNG, JPG, WebP)
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleQrSelect(file);
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
              {isEditing ? "Save changes" : "Add wallet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}