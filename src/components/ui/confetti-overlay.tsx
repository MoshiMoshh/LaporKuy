'use client';

import { useEffect, useState } from 'react';

interface ConfettiOverlayProps {
  show: boolean;
  onComplete?: () => void;
}

export function ConfettiOverlay({ show, onComplete }: ConfettiOverlayProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; color: string; size: number; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      const generated = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 10) + 8,
        delay: Math.random() * 0.5,
      }));
      setPieces(generated);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 animate-confetti-fall rounded-sm opacity-90"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: '2.5s',
          }}
        />
      ))}
    </div>
  );
}
