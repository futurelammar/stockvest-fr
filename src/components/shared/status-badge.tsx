'use client';
import { cn, getStatusColor } from '@/lib/utils';

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
      getStatusColor(status), className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}