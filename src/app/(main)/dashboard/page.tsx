'use client';

import { useState } from 'react';
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
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-[#F5F7FA]">
      
      {/* ═══════════════════════════════════════════════
          SIDEBAR (List & Filter)
      ═══════════════════════════════════════════════ */}
      <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-r border-[#D9DEE5] flex flex-col z-10 shadow-sm shrink-0">
        
        <div className="p-5 border-b border-slate-100">
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

          {/* Interactive Category Filters */}
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

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-500 mb-2">
            Menampilkan {filteredReports.length} aduan
          </p>
          
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card key={report.id} className="rounded-md border border-[#D9DEE5] shadow-sm overflow-hidden bg-white hover:border-[#0057B8]/40 transition-colors">
                <Link href={`/laporan/${report.id}`} className="block">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`rounded px-2 py-0.5 text-[10px] font-semibold border-transparent ${
                        report.status === 'Selesai' ? 'bg-[#15803D] text-white' : 
                        report.status === 'Diproses' ? 'bg-[#B45309] text-white' : 
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {report.status}
                      </Badge>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 uppercase tracking-wider font-semibold">
                        <Clock className="w-3 h-3" /> 1 Hari lalu
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#003B73] line-clamp-2 mb-2 leading-snug">
                      {report.title}
                    </h3>
                    <div className="flex items-start gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#0057B8]" />
                      <span className="line-clamp-1">{report.address}</span>
                    </div>
                  </div>
                </Link>
              </Card>
            ))
          ) : (
            <Card className="rounded-md border border-[#D9DEE5] shadow-sm bg-slate-50 p-8 text-center flex flex-col items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-slate-400 mb-3" />
              <h3 className="font-bold text-sm text-[#003B73]">Aduan Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Coba ubah kata kunci pencarian atau kategori filter Anda.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MAP VIEW
      ═══════════════════════════════════════════════ */}
      <div className="flex-1 relative z-0 h-[400px] md:h-auto">
        <MapView
          reports={filteredReports}
          mapMode="marker"
          showPredictiveZone={false}
        />
      </div>

    </div>
  );
}
