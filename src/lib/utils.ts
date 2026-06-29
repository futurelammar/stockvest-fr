import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours   = Math.floor(diff / 3600000);
  const days    = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24)   return `${hours}h ago`;
  if (days < 7)     return `${days}d ago`;
  return formatDate(date);
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    pending:   'text-amber-400 bg-amber-400/10 border-amber-400/20',
    approved:  'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    rejected:  'text-red-400 bg-red-400/10 border-red-400/20',
    paid:      'text-blue-400 bg-blue-400/10 border-blue-400/20',
    completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    active:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    inactive:  'text-slate-400 bg-slate-400/10 border-slate-400/20',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
    failed:    'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return map[status] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/20';
}

export function truncateAddress(address: string, chars = 6) {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}