"use client";

import { useState } from "react";
import { Plus, Pencil, Ban, Copy, CheckCheck, QrCode, Wallet, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import {
  useAdminWallets,
  useCreateWallet,
  useUpdateWallet,
  useDisableWallet,
} from "@/hooks/use-admin-wallets";
import type { AdminWallet, WalletFormPayload, UpdateWalletPayload } from "@/hooks/use-admin-wallets";
import { WalletFormDialog } from "@/components/admin/wallet-form-dialog";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";

const COIN_COLORS: Record<string, string> = {
  BTC: "bg-orange-50 text-orange-700",
  ETH: "bg-indigo-50 text-indigo-700",
  USDT: "bg-emerald-50 text-[#1F6F4F]",
  USDC: "bg-blue-50 text-blue-700",
  BNB: "bg-yellow-50 text-yellow-700",
  SOL: "bg-purple-50 text-purple-700",
  LTC: "bg-[#F7F4EE] text-[#5B6661]",
  DOGE: "bg-amber-50 text-amber-700",
  XRP: "bg-cyan-50 text-cyan-700",
  TRX: "bg-rose-50 text-rose-700",
};

function CoinBadge({ coinName }: { coinName: string }) {
  // Try to extract ticker symbol from name e.g. "Tether (USDT)" → "USDT"
  const match = coinName.match(/\(([^)]+)\)/);
  const ticker = match?.[1] ?? coinName.slice(0, 4).toUpperCase();
  const colorClass = COIN_COLORS[ticker] ?? "bg-[#F7F4EE] text-[#5B6661]";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colorClass}`}>
      {ticker}
    </span>
  );
}

function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="flex items-center gap-1.5 rounded-lg border border-[#D6D0C4] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0E1A17] transition-colors hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
      title={address}
    >
      {copied ? (
        <CheckCheck className="h-3.5 w-3.5 text-[#1F6F4F]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      <span className="max-w-[200px] truncate font-mono">{address}</span>
    </button>
  );
}

function QrCodeViewer({ url }: { url: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-[#D6D0C4] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0E1A17] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
      >
        <QrCode className="h-3.5 w-3.5" />
        View QR
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative rounded-2xl bg-white p-6 shadow-2xl">
            <Image
              src={url}
              alt="Wallet QR code"
              width={280}
              height={280}
              className="rounded-xl"
              unoptimized={!url.includes("cloudinary")}
            />
            <p className="mt-3 text-center text-xs text-[#5B6661]">
              Click outside to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-[#E5E0D4] bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-14 rounded-full bg-[#E5E0D4]" />
        <div className="h-5 w-16 rounded-full bg-[#E5E0D4]" />
      </div>
      <div className="h-3.5 w-24 rounded bg-[#E5E0D4]" />
      <div className="h-4 w-full rounded bg-[#E5E0D4]" />
    </div>
  );
}

export default function AdminWalletsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<AdminWallet | null>(null);
  const [disablingWallet, setDisablingWallet] = useState<AdminWallet | null>(null);
  const [updateId, setUpdateId] = useState<string>("");

  const { data: wallets, isLoading } = useAdminWallets();

  const createWallet = useCreateWallet();
  const updateWallet = useUpdateWallet(updateId);
  const disableWallet = useDisableWallet();

  const activeWallets = wallets?.filter((w) => w.status === "active") ?? [];
  const disabledWallets = wallets?.filter((w) => w.status === "disabled") ?? [];

  function openCreate() {
    setEditingWallet(null);
    setFormOpen(true);
  }

  function openEdit(wallet: AdminWallet) {
    setEditingWallet(wallet);
    setUpdateId(wallet._id);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingWallet(null);
  }

  function handleCreate(payload: WalletFormPayload) {
    createWallet.mutate(payload, { onSuccess: closeForm });
  }

  function handleUpdate(payload: UpdateWalletPayload) {
    updateWallet.mutate(payload, { onSuccess: closeForm });
  }

  const actionLoading = createWallet.isPending || updateWallet.isPending || disableWallet.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Deposit Wallets</h1>
          <p className="mt-0.5 text-sm text-[#5B6661]">
            Manage the wallet addresses users send deposits to.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#186040]"
        >
          <Plus className="h-4 w-4" /> Add wallet
        </button>
      </div>

      {/* ── Warning ── */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-white">
          !
        </div>
        <div className="text-sm text-amber-900">
          <p className="font-semibold">Always verify addresses before saving.</p>
          <p className="mt-0.5 text-amber-800/80">
            Users will send real funds to these addresses. A typo or wrong address
            means permanently lost deposits with no recovery path.
          </p>
        </div>
      </div>

      {/* ── Summary pills ── */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-[#E5E0D4] bg-white px-3 py-1.5 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#1F6F4F]" />
          <span className="font-semibold text-[#0E1A17]">{activeWallets.length}</span>
          <span className="text-[#5B6661]">active</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[#E5E0D4] bg-white px-3 py-1.5 text-xs">
          <Ban className="h-3.5 w-3.5 text-[#5B6661]" />
          <span className="font-semibold text-[#0E1A17]">{disabledWallets.length}</span>
          <span className="text-[#5B6661]">disabled</span>
        </div>
      </div>

      {/* ── Active wallets ── */}
      <div className="space-y-4">
        <h2 className="font-display text-base font-semibold text-[#0E1A17]">
          Active Wallets
        </h2>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!isLoading && activeWallets.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D6D0C4] bg-white py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F4EE]">
              <Wallet className="h-7 w-7 text-[#5B6661]" />
            </div>
            <p className="mt-4 font-display text-base font-semibold text-[#0E1A17]">
              No active wallets
            </p>
            <p className="mt-1 max-w-xs text-sm text-[#5B6661]">
              Add a wallet so users can deposit funds.
            </p>
            <button
              onClick={openCreate}
              className="mt-4 flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#186040]"
            >
              <Plus className="h-4 w-4" /> Add first wallet
            </button>
          </div>
        )}

        {!isLoading && activeWallets.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeWallets.map((wallet) => (
              <WalletCard
                key={wallet._id}
                wallet={wallet}
                onEdit={() => openEdit(wallet)}
                onDisable={() => setDisablingWallet(wallet)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Disabled wallets ── */}
      {!isLoading && disabledWallets.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-base font-semibold text-[#5B6661]">
            Disabled Wallets
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {disabledWallets.map((wallet) => (
              <WalletCard
                key={wallet._id}
                wallet={wallet}
                onEdit={() => openEdit(wallet)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Dialogs ── */}
      <WalletFormDialog
        open={formOpen}
        onClose={closeForm}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={handleUpdate}
        editingWallet={editingWallet}
        loading={actionLoading}
      />

      <ConfirmActionDialog
        open={!!disablingWallet}
        onClose={() => setDisablingWallet(null)}
        onConfirm={() => {
          if (disablingWallet) {
            disableWallet.mutate(disablingWallet._id, {
              onSuccess: () => setDisablingWallet(null),
            });
          }
        }}
        title="Disable this wallet?"
        description="Users will no longer see this wallet when submitting deposits. Existing deposit requests linked to it are unaffected."
        confirmLabel="Disable wallet"
        tone="danger"
        loading={disableWallet.isPending}
      />
    </div>
  );
}

function WalletCard({
  wallet,
  onEdit,
  onDisable,
}: {
  wallet: AdminWallet;
  onEdit: () => void;
  onDisable?: () => void;
}) {
  const isDisabled = wallet.status === "disabled";

  return (
    <div
      className={`rounded-xl border bg-white p-5 space-y-4 ${
        isDisabled ? "border-[#E5E0D4] opacity-60" : "border-[#E5E0D4] shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <CoinBadge coinName={wallet.coinName} />
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            isDisabled
              ? "bg-[#F7F4EE] text-[#5B6661]"
              : "bg-emerald-50 text-[#1F6F4F]"
          }`}
        >
          {wallet.status}
        </span>
      </div>

      {/* Meta */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[#0E1A17]">{wallet.coinName}</p>
        <p className="text-xs text-[#5B6661]">Network: {wallet.network}</p>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5B6661]">
          Address
        </p>
        <p className="break-all rounded-lg bg-[#F7F4EE] px-3 py-2 font-mono text-xs text-[#0E1A17]">
          {wallet.walletAddress}
        </p>
      </div>

      {/* Action row */}
      <div className="flex flex-wrap items-center gap-2 border-t border-[#F7F4EE] pt-3">
        <CopyAddress address={wallet.walletAddress} />

        {wallet.qrCodeImage && <QrCodeViewer url={wallet.qrCodeImage} />}

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D6D0C4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {!isDisabled && onDisable && (
            <button
              onClick={onDisable}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#A8392F]/30 bg-rose-50 text-[#A8392F] hover:bg-rose-100"
              title="Disable"
            >
              <Ban className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}