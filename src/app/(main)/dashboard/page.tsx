'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import dynamic from 'next/dynamic';
const MapView = dynamic(() => import('@/components/map/map-view').then(mod => mod.MapView), { ssr: false });
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
  Target,
  ThumbsUp,
  Loader2
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
  const [sheetHeight, setSheetHeight] = useState(40); // 40vh default
  const [isMobile, setIsMobile] = useState(false);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const startHeight = useRef(40);

  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial set via GSAP
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
        duration: 0.6, 
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
    if (newHeight < 15) newHeight = 15;
    if (newHeight > 95) newHeight = 95;

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
      if (sheetHeight < 30) animateToHeight(42);
      else if (sheetHeight < 70) animateToHeight(95);
      else animateToHeight(42);
      return;
    }

    if (sheetHeight < 25) animateToHeight(15);
    else if (sheetHeight > 70) animateToHeight(95);
    else animateToHeight(42);
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
    <div className="relative flex flex-col md:flex-row h-[calc(100dvh-128px)] md:h-[calc(100vh-64px)] bg-[#F5F7FA] overflow-hidden font-sans">
      
      {/* MAP VIEW */}
      <div className="absolute inset-0 md:relative md:inset-auto md:flex-1 md:h-auto z-0 pointer-events-auto">
        <MapView
          reports={filteredReports}
          mapMode="marker"
          showPredictiveZone={false}
          className="rounded-none md:rounded-2xl md:border md:shadow-inner"
        />
      </div>

      {/* MOBILE FLOATING HEADER */}
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

      {/* SIDEBAR / BOTTOM SHEET */}
      <div 
        ref={sheetRef}
        className="
          w-full md:w-[400px] lg:w-[450px] 
          absolute bottom-0 inset-x-0 md:relative md:bottom-auto md:inset-x-auto
          bg-white/95 md:bg-white 
          backdrop-blur-2xl md:backdrop-blur-none
          border-t md:border-t-0 md:border-r border-[#D9DEE5]/50 md:border-[#D9DEE5] 
          rounded-t-[28px] md:rounded-none
          flex flex-col z-20 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] md:shadow-sm 
          min-h-0 order-last md:order-first
        "
        style={{ maxHeight: isMobile ? '95%' : 'auto' }}
      >
        <div 
          className="md:hidden w-full flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing touch-none group"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="w-12 h-1.5 bg-slate-300 rounded-full group-hover:bg-[#0057B8] transition-colors" />
        </div>

        {/* ACTIVE QUEST BANNER */}
        {questParam && (
          <div className="mx-4 mt-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-3 shrink-0 animate-in fade-in duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0057B8] dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shrink-0">
                  <Target className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-100 dark:border-blue-900 text-[10px] font-medium px-2 py-0.5 rounded-md mb-1">
                    Misi Aktif
                  </Badge>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
                    {questTitle || 'Verifikator Komunitas'}
                  </h3>
                </div>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900 text-xs font-semibold shrink-0 px-2.5 py-1 rounded-md">
                +10 Pts Reward
              </Badge>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Panduan Pengerjaan</span>
              <div className="flex items-start gap-2.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold shrink-0 border border-slate-200 dark:border-slate-700 mt-0.5">
                  1
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Berikan Dukungan (Upvote) pada 3 laporan warga di bawah ini.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Horizontal Scroll */}
        <div className="flex gap-2 px-4 py-3 border-b border-slate-100 overflow-x-auto scrollbar-none shrink-0">
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
        </div>

        {/* Reports List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredReports.map((report) => (
            <Link key={report.id} href={`/laporan/${report.id}`} className="block">
              <Card className="p-3.5 hover:shadow-md transition-all border-slate-200/80 rounded-xl group bg-white">
                <div className="flex items-start gap-3">
                  <img
                    src={report.photoUrl}
                    alt={report.title}
                    className="h-16 w-16 rounded-lg object-cover border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] font-semibold text-[#0057B8] border-blue-200 bg-blue-50/50">
                        {report.category}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {report.createdAt.split('T')[0]}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#0057B8] transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{report.address}</span>
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <ThumbsUp className="h-3.5 w-3.5 text-blue-500" /> {report.upvotes} Dukungan
                      </span>
                      <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        report.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#0057B8] animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
