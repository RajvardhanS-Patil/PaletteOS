import * as React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'destructive' | 'info' | 'secondary';
}

function Badge({ className, variant = 'info', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none select-none',
        {
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': variant === 'success',
          'bg-amber-500/10 text-amber-400 border border-amber-500/20': variant === 'warning',
          'bg-red-500/10 text-red-400 border border-red-500/20': variant === 'destructive',
          'bg-brand-primary/10 text-brand-primary border border-brand-primary/20': variant === 'info',
          'bg-zinc-800 text-zinc-300 border border-zinc-700': variant === 'secondary',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
