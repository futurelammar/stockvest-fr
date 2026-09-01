"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ArrowDownToLine,
  Copy,
  CheckCheck,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ImageIcon,
  Info,
  Wallet,
} from "lucide-react";
import { useWallets, useMyDeposits, useUploadProof, useCreateDeposit } from "@/hooks/use-deposits";
import type { DepositStatus, Wallet as WalletType } from "@/types/deposit";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ─────────────────────────────────────────
   Status badge
───────────────────────────────────────── */
function StatusBadge({ status }: { status: DepositStatus }) {
  const map: Record<
    DepositStatus,
    { label: string; bg: string; text: string; icon: React.ReactNode }
  > = {
    pending: {
      label: "Pending",
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: <Clock className="h-3 w-3" />,
    },
    approved: {
      label: "Approved",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    rejected: {
      label: "Rejected",
      bg: "bg-rose-50",
      text: "text-rose-600",
      icon: <XCircle className="h-3 w-3" />,
    },
  };
  const { label, bg, text, icon } = map[status] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${bg} ${text}`}
    >
      {icon}
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────
   Copy button
───────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E0D4] bg-white px-3 py-1.5 text-xs font-medium text-[#5B6661] transition-colors hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
    >
      {copied ? (
        <>
          <CheckCheck className="h-3.5 w-3.5 text-[#1F6F4F]" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────
   QR Code Modal (click to enlarge)
───────────────────────────────────────── */
function QRCodeModal({
  src,
  coinName,
  onClose,
}: {
  src: string;
  coinName: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0E1A17] text-white hover:bg-[#1a2b26]"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="mb-4 text-center text-sm font-semibold text-[#0E1A17]">
          Scan to send {coinName}
        </p>
        <Image
          src={src}
          alt={`${coinName} QR code`}
          width={320}
          height={320}
          className="h-80 w-80 rounded-lg object-contain"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Wallet selector card
   — uses coinName, network, walletAddress, status
───────────────────────────────────────── */
function WalletCard({
  wallet,
  selected,
  onSelect,
}: {
  wallet: WalletType;
  selected: boolean;
  onSelect: () => void;
}) {
  // Derive a 2-letter ticker from the network field (e.g. "BTC" → "BT")
  const initials = wallet.network.slice(0, 2).toUpperCase();

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
        selected
          ? "border-[#1F6F4F] bg-emerald-50/60"
          : "border-[#E5E0D4] bg-white hover:border-[#1F6F4F]/40"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* QR / initials avatar */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0E1A17] text-xs font-bold text-emerald-400 overflow-hidden">
          {wallet.qrCodeImage ? (
            <Image
              src={wallet.qrCodeImage}
              alt={wallet.coinName}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#0E1A17]">{wallet.coinName}</p>
          <p className="text-[11px] text-[#5B6661]">{wallet.network}</p>
        </div>

        {selected && (
          <CheckCircle2 className="ml-auto h-5 w-5 flex-shrink-0 text-[#1F6F4F]" />
        )}
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────
   Proof image dropzone
───────────────────────────────────────── */
function ProofDropzone({
  onFileSelect,
  preview,
  onClear,
  uploading,
}: {
  onFileSelect: (file: File) => void;
  preview: string | null;
  onClear: () => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) onFileSelect(file);
    },
    [onFileSelect]
  );

  if (preview) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-[#1F6F4F]">
        <Image
          src={preview}
          alt="Proof preview"
          width={600}
          height={300}
          className="h-48 w-full object-cover"
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        {!uploading && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#D6D0C4] bg-[#FAFAF7] py-10 transition-colors hover:border-[#1F6F4F] hover:bg-emerald-50/30"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F4EE]">
        <ImageIcon className="h-6 w-6 text-[#5B6661]" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[#0E1A17]">
          Drop your screenshot here, or{" "}
          <span className="text-[#1F6F4F] underline underline-offset-2">browse</span>
        </p>
        <p className="mt-1 text-xs text-[#5B6661]">PNG, JPG or WEBP · max 5 MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Skeleton rows
───────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center justify-between border-b border-[#F1EDE2] px-5 py-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[#E5E0D4]" />
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-[#E5E0D4]" />
          <div className="h-2.5 w-16 rounded bg-[#E5E0D4]" />
        </div>
      </div>
      <div className="h-3 w-16 rounded bg-[#E5E0D4]" />
      <div className="h-5 w-16 rounded-full bg-[#E5E0D4]" />
      <div className="h-3 w-20 rounded bg-[#E5E0D4]" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Deposit form
───────────────────────────────────────── */
function DepositForm() {
  const { data: wallets, isLoading: walletsLoading } = useWallets();
  const uploadProof = useUploadProof();
  const createDeposit = useCreateDeposit();

  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [amountError, setAmountError] = useState("");
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Filter by status === "active" — matching the real backend enum value
  const activeWallets = (wallets ?? []).filter((w) => w.status === "active");

  async function handleFileSelect(file: File) {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploadedUrl(null);
    try {
      const result = await uploadProof.mutateAsync(file);
      setUploadedUrl(result.url);
    } catch {
      setPreview(null);
    }
  }

  function handleClearProof() {
    setPreview(null);
    setUploadedUrl(null);
  }

  function validateAmount(val: string) {
    const n = parseFloat(val);
    if (!val || isNaN(n)) return "Please enter an amount.";
    if (n <= 0) return "Amount must be greater than zero.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateAmount(amount);
    if (err) { setAmountError(err); return; }
    if (!selectedWallet || !uploadedUrl) return;

    await createDeposit.mutateAsync({
      walletId: selectedWallet._id,
      amount: parseFloat(amount),
      proofUrl: uploadedUrl,
    });

    // Reset on success
    setSelectedWallet(null);
    setAmount("");
    setPreview(null);
    setUploadedUrl(null);
    setAmountError("");
  }

  const canSubmit =
    !!selectedWallet &&
    !!amount &&
    !amountError &&
    !!uploadedUrl &&
    !createDeposit.isPending &&
    !uploadProof.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Step 1 — Choose wallet ── */}
      <div className="rounded-xl border border-[#E5E0D4] bg-white">
        <div className="border-b border-[#E5E0D4] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E1A17] text-[11px] font-bold text-white">
              1
            </span>
            <h2 className="font-display text-base font-semibold text-[#0E1A17]">
              Choose a wallet
            </h2>
          </div>
          <p className="mt-1 text-sm text-[#5B6661]">
            Select which cryptocurrency you'll be sending.
          </p>
        </div>

        <div className="p-6">
          {walletsLoading && (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-[#E5E0D4]" />
              ))}
            </div>
          )}

          {!walletsLoading && activeWallets.length === 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <Info className="h-4 w-4 flex-shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                No deposit wallets are configured yet. Please contact support.
              </p>
            </div>
          )}

          {!walletsLoading && activeWallets.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {activeWallets.map((w) => (
                <WalletCard
                  key={w._id}
                  wallet={w}
                  selected={selectedWallet?._id === w._id}
                  onSelect={() => setSelectedWallet(w)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Wallet address reveal */}
        {selectedWallet && (
          <div className="mx-6 mb-6 space-y-3 rounded-xl border border-[#1F6F4F]/30 bg-emerald-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1F6F4F]">
              Send {selectedWallet.network} to this address
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {/* Large scannable QR code */}
              {selectedWallet.qrCodeImage && (
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="group relative flex-shrink-0 overflow-hidden rounded-xl border-2 border-[#D6D0C4] bg-white p-2 transition-colors hover:border-[#1F6F4F]"
                >
                  <Image
                    src={selectedWallet.qrCodeImage}
                    alt={`${selectedWallet.coinName} QR code`}
                    width={160}
                    height={160}
                    className="h-40 w-40 object-contain"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs font-medium text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                    Tap to enlarge
                  </span>
                </button>
              )}

              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-[#D6D0C4] bg-white px-4 py-3">
                  <p className="flex-1 break-all font-mono text-sm text-[#0E1A17]">
                    {selectedWallet.walletAddress}
                  </p>
                  <CopyButton text={selectedWallet.walletAddress} />
                </div>
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    Only send {selectedWallet.coinName} ({selectedWallet.network}) to this
                    address. Sending the wrong asset may result in permanent loss.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {qrModalOpen && selectedWallet?.qrCodeImage && (
          <QRCodeModal
            src={selectedWallet.qrCodeImage}
            coinName={selectedWallet.coinName}
            onClose={() => setQrModalOpen(false)}
          />
        )}
      </div>

      {/* ── Step 2 — Amount ── */}
      <div className="rounded-xl border border-[#E5E0D4] bg-white">
        <div className="border-b border-[#E5E0D4] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E1A17] text-[11px] font-bold text-white">
              2
            </span>
            <h2 className="font-display text-base font-semibold text-[#0E1A17]">
              Enter amount
            </h2>
          </div>
          <p className="mt-1 text-sm text-[#5B6661]">
            How much USD equivalent are you depositing?
          </p>
        </div>

        <div className="p-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg font-semibold text-[#5B6661]">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setAmountError(e.target.value ? validateAmount(e.target.value) : "");
              }}
              className="h-14 w-full rounded-xl border-2 border-[#D6D0C4] bg-white pl-9 pr-4 font-mono text-xl text-[#0E1A17] outline-none transition-colors focus:border-[#1F6F4F] placeholder:text-[#D6D0C4]"
            />
          </div>
          {amountError && (
            <p className="mt-2 text-xs text-[#A8392F]">{amountError}</p>
          )}
        </div>
      </div>

      {/* ── Step 3 — Upload proof ── */}
      <div className="rounded-xl border border-[#E5E0D4] bg-white">
        <div className="border-b border-[#E5E0D4] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E1A17] text-[11px] font-bold text-white">
              3
            </span>
            <h2 className="font-display text-base font-semibold text-[#0E1A17]">
              Upload payment proof
            </h2>
          </div>
          <p className="mt-1 text-sm text-[#5B6661]">
            Screenshot of your transaction confirmation from your wallet or exchange.
          </p>
        </div>

        <div className="p-6">
          <ProofDropzone
            onFileSelect={handleFileSelect}
            preview={preview}
            onClear={handleClearProof}
            uploading={uploadProof.isPending}
          />
          {uploadProof.isPending && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[#5B6661]">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading image…
            </p>
          )}
          {uploadedUrl && !uploadProof.isPending && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[#1F6F4F]">
              <CheckCircle2 className="h-3 w-3" />
              Image uploaded successfully
            </p>
          )}
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F6F4F] py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#186040] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createDeposit.isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <ArrowDownToLine className="h-5 w-5" />
            Submit Deposit
          </>
        )}
      </button>

      <p className="text-center text-xs text-[#5B6661]">
        Deposits are reviewed manually and credited within 24 hours.
      </p>
    </form>
  );
}

/* ─────────────────────────────────────────
   Deposit history
───────────────────────────────────────── */
function DepositHistory() {
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const { data, isLoading } = useMyDeposits({ page, limit: LIMIT });
  const deposits = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="rounded-xl border border-[#E5E0D4] bg-white">
      <div className="border-b border-[#E5E0D4] px-6 py-4">
        <h2 className="font-display text-base font-semibold text-[#0E1A17]">
          Deposit history
        </h2>
      </div>

      {/* Column headers */}
      <div className="hidden grid-cols-[1fr_130px_110px_120px] items-center gap-4 border-b border-[#F1EDE2] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#5B6661] sm:grid">
        <span>Wallet</span>
        <span>Amount</span>
        <span>Status</span>
        <span>Date</span>
      </div>

      <div>
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

        {!isLoading && deposits.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F4EE]">
              <Wallet className="h-6 w-6 text-[#5B6661]" />
            </div>
            <p className="mt-3 font-display text-base font-semibold text-[#0E1A17]">
              No deposits yet
            </p>
            <p className="mt-1 text-sm text-[#5B6661]">
              Submit your first deposit using the form above.
            </p>
          </div>
        )}

        {!isLoading &&
          deposits.map((dep) => (
            <div
              key={dep._id}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-[#F1EDE2] px-5 py-4 last:border-0 sm:grid-cols-[1fr_130px_110px_120px]"
            >
              {/* Wallet */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0E1A17] text-[10px] font-bold text-emerald-400 overflow-hidden">
                  {dep.wallet.qrCodeImage ? (
                    <Image
                      src={dep.wallet.qrCodeImage}
                      alt={dep.wallet.coinName}
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  ) : (
                    dep.wallet.network.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0E1A17]">
                    {dep.wallet.coinName}
                  </p>
                  <p className="text-[11px] text-[#5B6661]">{dep.wallet.network}</p>
                </div>
              </div>

              {/* Amount */}
              <p className="font-mono text-sm font-semibold text-[#0E1A17]">
                {formatMoney(dep.amount)}
              </p>

              {/* Status */}
              <div>
                <StatusBadge status={dep.status} />
                {dep.status === "rejected" && dep.note && (
                  <p className="mt-1 text-[10px] text-[#A8392F]">{dep.note}</p>
                )}
              </div>

              {/* Date */}
              <p className="text-sm text-[#5B6661]">{fmtDate(dep.createdAt)}</p>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E0D4] px-5 py-4">
          <p className="text-xs text-[#5B6661]">
            Page {page} of {totalPages} · {data?.meta.total} deposits
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
                )
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
  );
}

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
export default function DepositPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Deposit Funds</h1>
        <p className="mt-0.5 text-sm text-[#5B6661]">
          Send crypto to one of our wallets and upload your payment proof.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <DepositForm />

        {/* Info sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-[#E5E0D4] bg-white p-5">
            <h3 className="mb-4 font-display text-sm font-bold text-[#0E1A17]">
              How deposits work
            </h3>
            <ol className="space-y-4">
              {[
                {
                  n: "1",
                  title: "Choose a wallet",
                  body: "Select the cryptocurrency you want to send.",
                },
                {
                  n: "2",
                  title: "Send the funds",
                  body: "Transfer to the wallet address shown. Double-check the network.",
                },
                {
                  n: "3",
                  title: "Upload proof",
                  body: "Screenshot of your transaction confirmation.",
                },
                {
                  n: "4",
                  title: "Wait for approval",
                  body: "Our team reviews within 24 hours and credits your balance.",
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F4EE] text-[11px] font-bold text-[#0E1A17]">
                    {step.n}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0E1A17]">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#5B6661]">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 flex-shrink-0 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-900">Important</h3>
            </div>
            <ul className="space-y-2 text-xs leading-relaxed text-amber-800">
              <li>• Always verify the wallet address before sending.</li>
              <li>• Only send the supported coin to each address.</li>
              <li>• Wrong network = permanent loss.</li>
              <li>• Deposits below the minimum may not be credited.</li>
            </ul>
          </div>
        </aside>
      </div>

      <DepositHistory />
    </div>
  );
}
