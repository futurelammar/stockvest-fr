'use client';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-muted rounded-lg', className)} />;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-primary/60" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        Previous
      </button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={cn('w-8 h-8 text-sm rounded-lg transition-colors',
            p === page ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
        className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        Next
      </button>
    </div>
  );
}