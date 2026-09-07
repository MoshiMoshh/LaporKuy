'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  heightClass?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Sebelum (Laporan)',
  afterLabel = 'Sesudah (Perbaikan)',
  heightClass = 'h-72 sm:h-96',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore if already released
    }
  };

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden rounded-2xl border border-border select-none touch-none group`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />
      <div className="absolute top-3 right-3 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md pointer-events-none">
        {afterLabel}
      </div>

      {/* Before Image (Clipped Foreground) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="h-full w-full max-w-none object-cover"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute top-3 left-3 rounded-full bg-rose-500/90 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md">
          {beforeLabel}
        </div>
      </div>

      {/* Divider Bar & Handle */}
      <div
        className="absolute inset-y-0 z-10 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-xl border-2 border-slate-100 transition-all ${
          isDragging ? 'scale-110 ring-4 ring-primary/30' : 'group-hover:scale-105'
        }`}>
          <SlidersHorizontal className="h-4 w-4 text-slate-700" />
        </div>
      </div>
    </div>
  );
}
