'use client';

import { useState, useRef } from 'react';
import { Report } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Flame, AlertTriangle, Layers, ThumbsUp, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';

interface MapViewProps {
  reports: Report[];
  mapMode?: 'marker' | 'heatmap';
  showPredictiveZone?: boolean;
  onSelectReport?: (report: Report) => void;
  className?: string;
}

export function MapView({
  reports,
  mapMode = 'marker',
  showPredictiveZone = false,
  onSelectReport,
  className = '',
}: MapViewProps) {
  const [selectedPin, setSelectedPin] = useState<Report | null>(reports[0] || null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Jalan Rusak':
        return 'bg-rose-500 text-white border-rose-600';
      case 'Lampu Mati':
        return 'bg-amber-500 text-white border-amber-600';
      case 'Sampah':
        return 'bg-emerald-500 text-white border-emerald-600';
      case 'Banjir':
        return 'bg-blue-500 text-white border-blue-600';
      case 'Trotoar Rusak':
        return 'bg-purple-500 text-white border-purple-600';
      default:
        return 'bg-slate-700 text-white border-slate-800';
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPanning, setIsAutoPanning] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPan = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPan.current = { x: pan.x, y: pan.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({
      x: initialPan.current.x + dx,
      y: initialPan.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[350px] overflow-hidden border-border bg-slate-950 text-slate-100 ${className}`}>
      
      {/* ════ DRAGGABLE MAP LAYER ════ */}
      <div 
        className={`absolute inset-0 touch-none select-none z-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div 
          className={`absolute inset-0 w-[200vw] h-[200vh] -left-[50vw] -top-[50vh] ${isAutoPanning ? 'transition-transform duration-500 ease-out' : 'transition-transform duration-0'}`}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          {/* Map Graphic Overlay Background (Simulated High-Tech City Grid Map) */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

          {/* Heatmap Gradient Overlay when Heatmap Mode active */}
          {mapMode === 'heatmap' && (
            <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_50%_40%,rgba(239,68,68,0.5)_0%,rgba(245,158,11,0.3)_35%,rgba(16,185,129,0.15)_70%,transparent_100%)] animate-pulse" />
          )}

          {/* Predictive Zone Highlight Layer */}
          {showPredictiveZone && (
            <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full border-2 border-dashed border-rose-400/80 bg-rose-500/10 flex items-center justify-center pointer-events-none animate-ping duration-1000">
              <Badge className="bg-rose-600 text-white shadow-lg text-[10px] uppercase tracking-wider font-bold">
                ⚠️ AI Predicted Risk Zone (Banjir Hujan)
              </Badge>
            </div>
          )}

          {/* Interactive Map Pin Markers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl max-h-[800px]">
              {reports.map((report, idx) => {
                // Distribute markers visually across map grid
                const positions = [
                  { top: '35%', left: '28%' },
                  { top: '65%', left: '72%' },
                  { top: '25%', left: '80%' },
                  { top: '55%', left: '20%' },
                  { top: '45%', left: '50%' },
                ];
                const pos = positions[idx % positions.length];

                const isSelected = selectedPin?.id === report.id;

                return (
                  <div
                    key={report.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    onPointerDown={(e) => {
                      // Prevent map drag when clicking a pin
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      setSelectedPin(report);
                      onSelectReport?.(report);

                      // Auto-pan to center
                      if (containerRef.current) {
                        const containerRect = containerRef.current.getBoundingClientRect();
                        const pinRect = e.currentTarget.getBoundingClientRect();
                        
                        // Calculate difference from center of container to center of pin
                        const dx = (containerRect.width / 2) - (pinRect.left - containerRect.left + pinRect.width / 2);
                        
                        // Offset Y slightly downwards on mobile so the popup doesn't block the pin
                        const isMobile = window.innerWidth < 768;
                        const yOffset = isMobile ? (containerRect.height / 4) : 0;
                        const dy = (containerRect.height / 2) - (pinRect.top - containerRect.top + pinRect.height / 2) + yOffset;
                        
                        setIsAutoPanning(true);
                        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                        
                        // Reset transition duration after animation completes
                        setTimeout(() => setIsAutoPanning(false), 500);
                      }
                    }}
                  >
                    {/* Marker Ping Pulse */}
                    <span className={`absolute -inset-1 rounded-full opacity-75 animate-ping ${mapMode === 'heatmap' ? 'bg-rose-500' : 'bg-primary'}`} />

                    {/* Marker Pin Icon */}
                    <div
                      className={`relative flex items-center gap-1 px-2.5 py-1 rounded-full shadow-xl border text-xs font-bold transition-all transform hover:scale-115 ${
                        isSelected ? 'ring-4 ring-white scale-110 z-20' : 'z-10'
                      } ${getCategoryColor(report.category)}`}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{report.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ════ STATIC UI LAYER ════ */}
      <div className="relative z-10 p-4 pointer-events-none flex flex-col justify-between h-full">
        
        {/* Top Map Control Bar - Hidden on mobile to prevent overlap with floating search */}
        <div className="pointer-events-auto hidden md:flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-lg">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
              📍 Surabaya & Sekitarnya
            </Badge>
            <span className="text-xs text-slate-400 font-medium">
              {reports.length} Laporan Terdaftar
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Mode Visual:</span>
            <Badge
              className={mapMode === 'marker' ? 'bg-primary text-primary-foreground' : 'bg-slate-800 text-slate-400'}
            >
              {mapMode === 'marker' ? 'Pin Markers' : 'Heatmap Density'}
            </Badge>
          </div>
        </div>

        {/* Selected Pin Popup Card */}
        <div className="pointer-events-auto mt-24 md:mt-0 max-w-[90vw] md:max-w-none mx-auto md:mx-0">
          {selectedPin && (
            <Card className="relative z-10 bg-slate-900/95 text-slate-100 border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPin.photoUrl}
                    alt={selectedPin.title}
                    className="h-14 w-14 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                        {selectedPin.category}
                      </Badge>
                      <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-[10px]">
                        Keparahan: {selectedPin.severity}/10
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 line-clamp-1 mt-0.5">
                      {selectedPin.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      📍 {selectedPin.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <div className="text-xs text-slate-400 flex items-center gap-1 mr-2">
                    <ThumbsUp className="h-3.5 w-3.5 text-blue-400" />
                    <span>{selectedPin.upvotes} Dukungan</span>
                  </div>
                  <Link href={`/laporan/${selectedPin.id}`}>
                    <Button size="sm" className="h-8 text-xs gap-1 bg-primary hover:bg-primary/90">
                      <Eye className="h-3.5 w-3.5" />
                      Detail
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
