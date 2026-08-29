'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * Clean loading component with simple variants.
 * No AI slop, no orbs, no pulse-glow. Accessible and clean.
 */
export function AILoading({ 
  variant = 'spinner', 
  size = 'md', 
  text,
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm font-medium',
    lg: 'text-base font-medium',
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <Loader2 className={cn(sizeClasses[size], 'text-primary animate-spin')} />
        {text && <p className={cn(textSizeClasses[size], 'text-muted-foreground font-medium')}>{text}</p>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
        {text && <span className={cn(textSizeClasses[size], 'text-muted-foreground ml-2 font-medium')}>{text}</span>}
      </div>
    );
  }

  // skeleton
  return (
    <div className={cn('space-y-4', className)}>
      <div className="h-6 w-1/3 rounded-md bg-muted animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-muted animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-muted animate-pulse delay-75" />
        <div className="h-4 w-2/3 rounded bg-muted animate-pulse delay-150" />
      </div>
    </div>
  );
}

// Skeleton card variant for backward compatibility
export function AILoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-6 space-y-5', className)}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
        <div className="h-6 w-1/3 rounded-md bg-muted animate-pulse" />
      </div>
      <div className="space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-4 rounded bg-muted animate-pulse"
            style={{ width: `${100 - i * 15}%`, animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      <div className="pt-2">
        <div className="h-10 w-1/4 rounded-xl bg-muted animate-pulse" />
      </div>
    </div>
  );
}