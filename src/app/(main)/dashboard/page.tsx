'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLaporKuyStore } from '@/lib/store';
import { MapView } from '@/components/map/map-view';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export default function DashboardPage() {
  const { reports } = useLaporKuyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  // Bottom Sheet Drag Logic
  const [sheetHeight, setSheetHeight] = useState(40); // 40vh default
  const [isMobile, setIsMobile] = useState(false);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const startHeight = useRef(40);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
    startHeight.current = sheetHeight;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaY = dragStartY.current - e.clientY; // Negative if dragging down
    const vh = window.innerHeight;
    const deltaVh = (deltaY / vh) * 100;
    
    let newHeight = startHeight.current + deltaVh;
    if (newHeight < 15) newHeight = 15; // Min height: just the handle and categories
    if (newHeight > 95) newHeight = 95; // Max height: below search bar
    
    setSheetHeight(newHeight);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    // Snap physics
    if (sheetHeight < 25) setSheetHeight(15); // Snapped minimized state
    else if (sheetHeight > 70) setSheetHeight(95); // Snapped expanded state
    else setSheetHeight(42); // Snapped default state
  };

  // Filter reports based on search query and selected category
  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      report.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === 'Semua' || report.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative flex flex-col md:flex-row h-[calc(100dvh-128px)] md:h-[calc(100vh-64px)] bg-[#F5F7FA] overflow-hidden">
      
      {/* ═══════════════════════════════════════════════
          MAP VIEW (Mobile: Absolute Full, Desktop: Relative Flex)
      ═══════════════════════════════════════════════ */}
      <div className="absolute inset-0 md:relative md:inset-auto md:flex-1 md:h-auto z-0 pointer-events-auto">
        <MapView
          reports={filteredReports}
          mapMode="marker"
          showPredictiveZone={false}
          className="rounded-none md:rounded-2xl md:border md:shadow-inner"
        />
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE FLOATING HEADER (Search & Filter)
      ═══════════════════════════════════════════════ */}
      <div className="md:hidden absolute top-4 inset-x-4 z-10 space-y-3 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto drop-shadow-xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari aduan atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 w-full rounded-2xl border-none shadow-none bg-white/95 backdrop-blur-xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#0057B8]"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 rounded-2xl border-none shadow-none bg-white/95 backdrop-blur-xl text-slate-600 hover:text-[#0057B8]">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SIDEBAR / BOTTOM SHEET (List)
      ═══════════════════════════════════════════════ */}
      <div 
        className="
          w-full md:w-[400px] lg:w-[450px] 
          absolute bottom-0 inset-x-0 md:relative md:bottom-auto md:inset-x-auto
          bg-white/95 md:bg-white 
          backdrop-blur-2xl md:backdrop-blur-none
          border-t md:border-t-0 md:border-r border-[#D9DEE5]/50 md:border-[#D9DEE5] 
          rounded-t-[28px] md:rounded-none
          flex flex-col z-20 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] md:shadow-sm 
          min-h-0 order-last md:order-first
          transition-[height] duration-200 ease-out md:transition-none
        "
        style={{ height: isMobile ? `${sheetHeight}%` : 'auto', maxHeight: isMobile ? '95%' : 'auto' }}
      >
        {/* Mobile Drag Handle Visual */}
        <div 
          className="md:hidden w-full flex justify-center pt-3 pb-3 shrink-0 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="w-10 h-1 rounded-full bg-slate-300 pointer-events-none" />
        </div>

        {/* Mobile Filters Horizontal Scroll (Inside Sheet) */}
        <div className="md:hidden flex gap-2 overflow-x-auto hide-scrollbar px-5 pb-3 pt-1 shrink-0 touch-pan-x">
          {['Semua', 'Jalan Rusak', 'Fasilitas Umum', 'Lampu Mati', 'Sampah'].map((cat) => (
            <Badge 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer rounded-xl px-4 py-1.5 text-[11px] font-bold transition-colors whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-[#0057B8] text-white border-transparent' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent'
              }`}
            >
              {cat}
            </Badge>
          ))}
        </div>
        
        {/* Desktop Header */}
        <div className="hidden md:block p-5 border-b border-slate-100 shrink-0">
          <h1 className="text-xl font-bold text-[#003B73] mb-4">Peta Persebaran Aduan</h1>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari aduan atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 w-full rounded-md border-[#D9DEE5] text-sm focus-visible:ring-[#0057B8]"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-md border-[#D9DEE5] text-slate-600 hover:text-[#0057B8]">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {['Semua', 'Jalan Rusak', 'Fasilitas Umum', 'Lampu Mati', 'Sampah'].map((cat) => (
              <Badge 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer rounded px-2.5 py-1 font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-[#0057B8] text-white hover:bg-[#003B73]' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent'
                }`}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3 pb-8 touch-pan-y overscroll-contain">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 md:px-0">
            {filteredReports.length} Aduan Sekitar Anda
          </p>
          
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card key={report.id} className="rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden bg-white/80 md:bg-white hover:border-[#0057B8]/40 transition-colors p-4 backdrop-blur-sm">
                <Link href={`/laporan/${report.id}`} className="block">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-transparent ${
                      report.status === 'Selesai' ? 'bg-green-100 text-green-700' : 
                      report.status === 'Diproses' ? 'bg-amber-100 text-amber-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {report.status}
                    </Badge>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> 1 Hari lalu
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 line-clamp-2 mb-2 leading-snug">
                    {report.title}
                  </h3>
                  <div className="flex items-start gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#0057B8]" />
                    <span className="line-clamp-1">{report.address}</span>
                  </div>
                </Link>
              </Card>
            ))
          ) : (
            <Card className="rounded-2xl border border-slate-200/60 shadow-sm bg-white/50 p-8 text-center flex flex-col items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-slate-300 mb-3" />
              <h3 className="font-bold text-sm text-slate-700">Tidak Ada Laporan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ganti kata kunci atau area pencarian.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
