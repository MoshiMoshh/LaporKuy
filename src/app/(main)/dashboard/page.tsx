'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import dynamic from 'next/dynamic';
const MapView = dynamic(() => import('@/components/map/map-view').then(mod => mod.MapView), { ssr: false });
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Target,
  ThumbsUp,
  Loader2,
  Layers
} from 'lucide-react';
import gsap from 'gsap';

function DashboardContent() {
  const { reports } = useLaporKuyStore();
  const searchParams = useSearchParams();
  const questParam = searchParams.get('quest');
  const questTitle = searchParams.get('title');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  // Bottom Sheet Drag Logic
  const [sheetHeight, setSheetHeight] = useState(42);
  const [isMobile, setIsMobile] = useState(false);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const startHeight = useRef(42);

  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && sheetRef.current) {
      gsap.set(sheetRef.current, { height: `${sheetHeight}%` });
    }
  }, [isMobile]);

  const animateToHeight = (target: number) => {
    setSheetHeight(target);
    if (sheetRef.current) {
      gsap.to(sheetRef.current, { 
        height: `${target}%`, 
        duration: 0.5, 
        ease: 'power3.out' 
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
    startHeight.current = sheetHeight;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaY = dragStartY.current - e.clientY;
    const windowHeight = window.innerHeight;
    const deltaPercent = (deltaY / windowHeight) * 100;
    
    let newHeight = startHeight.current + deltaPercent;
    if (newHeight < 16) newHeight = 16;
    if (newHeight > 94) newHeight = 94;

    setSheetHeight(newHeight);
    if (sheetRef.current) {
      gsap.set(sheetRef.current, { height: `${newHeight}%` });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }

    const moveY = Math.abs(e.clientY - dragStartY.current);
    if (moveY < 5) {
      if (sheetHeight < 30) animateToHeight(45);
      else if (sheetHeight < 70) animateToHeight(94);
      else animateToHeight(45);
      return;
    }

    if (sheetHeight < 26) animateToHeight(16);
    else if (sheetHeight > 70) animateToHeight(94);
    else animateToHeight(45);
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      report.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === 'Semua' || report.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative flex flex-col md:flex-row h-[calc(100dvh-128px)] md:h-[calc(100vh-64px)] bg-background overflow-hidden font-sans">
      
      {/* MAP VIEW */}
      <div className="absolute inset-0 md:relative md:inset-auto md:flex-1 md:h-auto z-0 pointer-events-auto">
        <MapView
          reports={filteredReports}
          mapMode="marker"
          showPredictiveZone={false}
          className="rounded-none md:rounded-3xl md:m-3 md:border md:border-border md:shadow-card overflow-hidden"
        />
      </div>

      {/* MOBILE FLOATING SEARCH HEADER */}
      <div className="md:hidden absolute top-4 inset-x-4 z-10 space-y-3 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto drop-shadow-lg">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari aduan atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 w-full rounded-2xl border-none shadow-card bg-white/90 backdrop-blur-2xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary text-foreground"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 rounded-2xl border-none shadow-card bg-white/90 backdrop-blur-2xl text-foreground/70 hover:text-primary active:scale-95 transition-transform touch-manipulation">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* SIDEBAR / BOTTOM SHEET */}
      <div 
        ref={sheetRef}
        className="
          w-full md:w-[410px] lg:w-[460px] 
          absolute bottom-0 inset-x-0 md:relative md:bottom-auto md:inset-x-auto
          bg-white/95 md:bg-card 
          backdrop-blur-2xl md:backdrop-blur-none
          border-t md:border-t-0 md:border-r border-border
          rounded-t-[32px] md:rounded-none
          flex flex-col z-20 shadow-[0_-8px_32px_rgba(13,27,46,0.12)] md:shadow-none 
          min-h-0 order-last md:order-first
        "
        style={{ maxHeight: isMobile ? '94%' : 'auto' }}
      >
        {/* Drag Pill Handle */}
        <div 
          className="md:hidden w-full flex flex-col items-center pt-3.5 pb-2 shrink-0 select-none touch-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label="Tarik panel aduan"
        >
          <div className="w-14 h-1.5 bg-muted-foreground/30 rounded-full transition-all active:w-20 active:bg-primary" />
        </div>

        {/* ACTIVE QUEST BANNER */}
        {questParam && (
          <div className="mx-4 mt-2 p-4 bg-card border border-border rounded-2xl shadow-sm space-y-3 shrink-0 animate-in fade-in duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <Target className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                    Misi Aktif
                  </Badge>
                  <h3 className="text-sm font-bold text-foreground tracking-tight leading-snug">
                    {questTitle || 'Verifikator Komunitas'}
                  </h3>
                </div>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 text-xs font-bold shrink-0 px-2.5 py-1 rounded-full">
                +10 Pts Reward
              </Badge>
            </div>

            <div className="pt-2 border-t border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Panduan Pengerjaan</span>
              <div className="flex items-start gap-2.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-foreground text-[10px] font-bold shrink-0 border border-border mt-0.5">
                  1
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Berikan Dukungan (Upvote) pada 3 laporan warga di bawah ini.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:block p-5 border-b border-border shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Peta Persebaran Aduan
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {filteredReports.length} Laporan
            </span>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari aduan atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 w-full rounded-2xl border-border text-sm focus-visible:ring-primary"
              />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 rounded-2xl border-border text-muted-foreground hover:text-primary">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter Horizontal Scroll */}
        <div className="flex gap-2 px-4 py-3 border-b border-border/60 overflow-x-auto scrollbar-hide shrink-0 touch-pan-x select-none">
          {['Semua', 'Jalan Rusak', 'Fasilitas Umum', 'Lampu Mati', 'Sampah'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`touch-manipulation select-none rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 whitespace-nowrap min-h-[36px] flex items-center justify-center ${
                activeCategory === cat 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-muted/80 text-muted-foreground active:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {filteredReports.map((report) => (
            <Link key={report.id} href={`/laporan/${report.id}`} className="block">
              <div className="p-3.5 hover:shadow-card transition-all border border-border rounded-2xl group bg-card hover:border-primary/30 active:scale-[0.98] touch-manipulation">
                <div className="flex items-start gap-3.5">
                  <img
                    src={report.photoUrl}
                    alt={report.title}
                    className="h-18 w-18 rounded-xl object-cover border border-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                        {report.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {report.createdAt.split('T')[0]}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span>{report.address}</span>
                    </p>
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/60 text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1 font-semibold">
                        <ThumbsUp className="h-3.5 w-3.5 text-primary" /> {report.upvotes} Dukungan
                      </span>
                      <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                        report.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm font-semibold">Tidak ada aduan ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
