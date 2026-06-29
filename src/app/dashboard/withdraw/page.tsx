'use client';

import { useState } from 'react';
import {
  ArrowUpFromLine, Clock, AlertTriangle, ChevronDown, CheckCircle,
} from 'lucide-react';
import { useMyWithdrawals, useCreateWithdrawal } from '@/hooks/use-withdrawals';
import { SUPPORTED_COINS, QueryWithdrawalsDto, WithdrawalStatus } from '@/types/withdrawal';
import { formatCurrency, formatRelativeTime, truncateAddress, cn } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState, PageLoader, Pagination } from '@/components/shared/index';
import { DashboardTopbar } from '../../../components/layout/dashboard-topbar';
import { useCurrentUser } from "@/hooks/use-auth";

const STATUS_TABS: { label: string; value: WithdrawalStatus | 'all' }[] = [
  { label: 'All',      value: 'all' },
  { label: 'Pending',  value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Paid',     value: 'paid' },
  { label: 'Rejected', value: 'rejected' },
];

function WithdrawForm({ balance }: { balance: number }) {
  const [coinSymbol, setCoinSymbol] = useState('');
  const [network, setNetwork]       = useState('');
  const [address, setAddress]       = useState('');
  const [amount, setAmount]         = useState('');

  const createWithdrawal = useCreateWithdrawal();
  const selectedCoin = SUPPORTED_COINS.find(c => c.symbol === coinSymbol);

  const numAmount      = parseFloat(amount) || 0;
  const isInsufficient = numAmount > balance;
  const canSubmit =
    coinSymbol && network && address.trim() && numAmount > 0 &&
    !isInsufficient && !createWithdrawal.isPending;

  const handleCoinChange = (val: string) => { setCoinSymbol(val); setNetwork(''); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWithdrawal.mutate(
      { coinType: coinSymbol, network, walletAddress: address.trim(), amount: numAmount },
      { onSuccess: () => { setCoinSymbol(''); setNetwork(''); setAddress(''); setAmount(''); } },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
            Available Balance
          </p>
          <p className="text-xl sm:text-2xl font-bold text-foreground font-mono truncate">
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ArrowUpFromLine className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cryptocurrency</label>
        <div className="relative">
          <select value={coinSymbol} onChange={e => handleCoinChange(e.target.value)} required
            className="w-full appearance-none py-3 sm:py-2.5 pl-3 pr-9 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all">
            <option value="">Select a coin</option>
            {SUPPORTED_COINS.map(c => (
              <option key={c.symbol} value={c.symbol}>{c.name} ({c.symbol})</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {selectedCoin && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Network</label>
          <div className="relative">
            <select value={network} onChange={e => setNetwork(e.target.value)} required
              className="w-full appearance-none py-3 sm:py-2.5 pl-3 pr-9 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all">
              <option value="">Select network</option>
              {selectedCoin.networks.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Receiving Address</label>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} required
          placeholder="Paste your wallet address here"
          className="w-full py-3 sm:py-2.5 px-3 rounded-xl bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount (USD)</label>
          <button type="button" onClick={() => setAmount(balance.toString())}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
            Use max
          </button>
        </div>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="1" step="0.01" placeholder="0.00"
            className={cn(
              'w-full py-3 sm:py-2.5 pl-7 pr-4 rounded-xl bg-secondary border text-foreground text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all',
              isInsufficient ? 'border-destructive focus:ring-destructive' : 'border-border',
            )} />
        </div>
        {isInsufficient && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Amount exceeds your available balance
          </p>
        )}
      </div>

      <div className="flex gap-2.5 bg-accent/10 border border-accent/25 rounded-xl p-3 sm:p-3.5">
        <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-accent/90 leading-relaxed">
          Always double-check your wallet address and network.
          Withdrawals sent to a wrong address <strong>cannot be reversed</strong>.
          Your balance is held immediately and refunded only if the request is rejected.
        </p>
      </div>

      <button type="submit" disabled={!canSubmit}
        className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {createWithdrawal.isPending ? 'Submitting…' : 'Submit Withdrawal Request'}
      </button>
    </form>
  );
}

function WithdrawalRow({ w }: { w: any }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 sm:p-4 space-y-2.5 hover:border-primary/20 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {w.coinType}
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">· {w.network}</span>
          </p>
          <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
            {truncateAddress(w.walletAddress, 10)}
          </p>
        </div>
        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start shrink-0 gap-2 sm:gap-1">
          <p className="font-bold text-foreground font-mono">{formatCurrency(w.amount)}</p>
          <StatusBadge status={w.status} />
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <Clock className="w-3.5 h-3.5 shrink-0" />
        {formatRelativeTime(w.createdAt)}
        {w.status === 'paid' && w.paidAt && (
          <span className="text-primary flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Paid {formatRelativeTime(w.paidAt)}
          </span>
        )}
      </div>

      {w.adminNote && (
        <p className="text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2 border border-border break-words">
          <span className="font-medium text-foreground">Admin note: </span>{w.adminNote}
        </p>
      )}
    </div>
  );
}

export default function WithdrawPage() {
  const { data: user } = useCurrentUser();
  const [statusFilter, setStatusFilter] = useState<WithdrawalStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const params: QueryWithdrawalsDto = {
    page,
    limit: 10,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  const { data, isLoading } = useMyWithdrawals(params);
  const withdrawals = data?.data ?? [];
  const meta        = data?.meta;

  return (
    <div>
      <DashboardTopbar title="Withdraw" subtitle="Request a crypto withdrawal from your balance" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 fade-in max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-8 items-start">

          <WithdrawForm balance={user?.balance ?? 0} />

          <div className="space-y-4 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="font-semibold text-foreground">Withdrawal History</h2>
              {meta && (
                <span className="text-xs text-muted-foreground">
                  {meta.total} request{meta.total !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex gap-1 p-1 bg-secondary rounded-xl border border-border overflow-x-auto sm:flex-wrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {STATUS_TABS.map(t => (
                <button key={t.value} onClick={() => { setStatusFilter(t.value); setPage(1); }}
                  className={cn(
                    'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                    statusFilter === t.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}>
                  {t.label}
                </button>
              ))}
            </div>

            {isLoading ? <PageLoader /> : withdrawals.length === 0 ? (
              <EmptyState icon={ArrowUpFromLine} title="No withdrawals yet"
                description={statusFilter === 'all'
                  ? 'Withdrawal requests will appear here once you submit one.'
                  : `No ${statusFilter} withdrawals found.`} />
            ) : (
              <div className="space-y-2.5">
                {withdrawals.map((w: any) => <WithdrawalRow key={w._id} w={w} />)}
              </div>
            )}

            {meta && <Pagination page={page} totalPages={meta.totalPages} onPageChange={setPage} />}
          </div>
        </div>
      </div>
    </div>
  );
}