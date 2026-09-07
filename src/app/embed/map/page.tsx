'use client';

import dynamic from 'next/dynamic';
import { useLaporKuyStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';

const MapView = dynamic(() => import('@/components/map/map-view').then(mod => mod.MapView), { ssr: false });

export default function EmbedMapPage() {
  const { reports } = useLaporKuyStore();

  return (
    <div className="w-full h-screen relative bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top Header Bar for Embed */}
      <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Logo size={24} theme="dark" layout="horizontal" />
          <span className="text-xs text-slate-400 border-l border-slate-700 pl-3">
            Peta Transparansi Aduan Kota
          </span>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px]">
          ● Live Data ({reports.length} Laporan)
        </Badge>
      </div>

      {/* Map View Container */}
      <div className="flex-1 relative w-full h-full">
        <MapView reports={reports} className="h-full w-full border-none" />
      </div>
    </div>
  );
}
