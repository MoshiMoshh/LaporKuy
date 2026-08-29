'use client';

import { cn } from '@/lib/utils';

interface SubtleBackgroundProps {
  className?: string;
  variant?: 'gradient' | 'grid' | 'plain';
}

/**
 * A subtle, clean background decoration component.
 * No neural networks, no floating orbs, no scanlines.
 */
export function AIBackground({ 
  className, 
  variant = 'gradient', 
}: SubtleBackgroundProps) {
  if (variant === 'grid') {
    return (
      <div className={cn('fixed inset-0 -z-10', className)}>
        <div className="absolute inset-0 bg-grid-pattern-subtle" />
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={cn('fixed inset-0 -z-10', className)}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </div>
    );
  }

  return null;
}

// Keep exports for backward compatibility but as simple wrappers
export function AIOrb({ className }: { className?: string; size?: number; color?: string; blur?: string }) {
  return <div className={cn('hidden', className)} />;
}

export function AIScanlines({ className }: { className?: string; intensity?: number }) {
  return <div className={cn('hidden', className)} />;
}

export function AIVignette({ className }: { className?: string; intensity?: number }) {
  return <div className={cn('hidden', className)} />;
}