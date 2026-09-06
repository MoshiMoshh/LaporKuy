'use client';

import { useState, useRef, useEffect } from 'react';
import { Report } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, ThumbsUp, Eye, Compass } from 'lucide-react';
import Link from 'next/link';

// Leaflet imports
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  reports: Report[];
  mapMode?: 'marker' | 'heatmap';
  showPredictiveZone?: boolean;
  onSelectReport?: (report: Report) => void;
  className?: string;
}

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'qNmsb52QZkhFrzAr5QnL';

// Component to handle map interactions
function MapController({ selectedPin }: { selectedPin: Report | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedPin && selectedPin.lat && selectedPin.lng) {
      map.flyTo([selectedPin.lat, selectedPin.lng], 15, { duration: 1.5 });
    }
  }, [selectedPin, map]);
  return null;
}

// Model 3: Minimalist Google Maps Floating Action Controls (Top-Right)
function FloatingMapControls() {
  const map = useMap();

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    map.zoomIn();
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    map.zoomOut();
  };

  const handleFocusLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Focus location (Surabaya / Bogor)
    map.flyTo([-7.2575, 112.7521], 15, { duration: 1.2 });
  };

  const handleOverviewJava = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Overview Se-Pulau Jawa
    map.flyTo([-7.3, 110.0], 7.5, { duration: 1.5 });
  };

  return (
    <div
      className="leaflet-top leaflet-right"
      style={{
        pointerEvents: 'auto',
        zIndex: 1000,
        margin: '16px 16px 0 0',
      }}
    >
      <div className="flex flex-col gap-1.5 p-1 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg select-none">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center font-bold text-lg shadow-xs touch-manipulation"
          title="Zoom In"
          aria-label="Perbesar Peta"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center font-bold text-lg shadow-xs touch-manipulation"
          title="Zoom Out"
          aria-label="Perkecil Peta"
        >
          −
        </button>
        <button
          type="button"
          onClick={handleFocusLocation}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center text-sm shadow-xs touch-manipulation"
          title="Fokus Lokasi"
          aria-label="Fokus Lokasi"
        >
          📍
        </button>
        <button
          type="button"
          onClick={handleOverviewJava}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center text-sm shadow-xs touch-manipulation"
          title="Tinjauan Se-Pulau Jawa"
          aria-label="Tinjauan Se-Pulau Jawa"
        >
          🗺️
        </button>
      </div>
    </div>
  );
}

export function MapView({
  reports,
  mapMode = 'marker',
  showPredictiveZone = false,
  onSelectReport,
  className = '',
}: MapViewProps) {
  const [selectedPin, setSelectedPin] = useState<Report | null>(reports[0] || null);
  const [mapTheme, setMapTheme] = useState<'dataviz-dark' | 'streets-v2' | 'satellite'>('dataviz-dark');

  const getTileUrl = () => {
    return `https://api.maptiler.com/maps/${mapTheme}/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;
  };

  const getCategoryColorHex = (category: string) => {
    switch (category) {
      case 'Jalan Rusak': return '#f43f5e'; // rose-500
      case 'Lampu Mati': return '#f59e0b'; // amber-500
      case 'Sampah': return '#10b981'; // emerald-500
      case 'Banjir': return '#3b82f6'; // blue-500
      case 'Trotoar Rusak': return '#a855f7'; // purple-500
      default: return '#334155'; // slate-700
    }
  };

  const createCustomIcon = (report: Report, isSelected: boolean) => {
    const color = getCategoryColorHex(report.category);
    const ring = isSelected ? 'box-shadow: 0 0 0 4px white;' : '';
    const zIndex = isSelected ? 1000 : 1;
    
    const htmlString = `
      <div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 999px; font-weight: bold; font-size: 11px; white-space: nowrap; display: flex; align-items: center; gap: 4px; border: 1px solid rgba(255,255,255,0.2); transition: all 0.2s; ${ring}">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        ${report.category}
      </div>
    `;

    return L.divIcon({
      html: htmlString,
      className: 'custom-leaflet-marker',
      iconSize: [100, 24],
      iconAnchor: [50, 24],
      popupAnchor: [0, -24],
    });
  };

  // Center of Surabaya
  const centerPosition: [number, number] = [-7.2575, 112.7521];

  return (
    <div className={`relative w-full h-full min-h-[350px] overflow-hidden border-border bg-slate-950 text-slate-100 ${className}`}>
      
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={centerPosition} 
          zoom={13} 
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', background: '#020617' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={getTileUrl()}
          />
          
          <MapController selectedPin={selectedPin} />
          <FloatingMapControls />

          {reports.map((report, idx) => {
            // Generate some random coordinates near Surabaya center if missing
            const lat = report.lat || -7.2575 + (Math.random() - 0.5) * 0.05;
            const lng = report.lng || 112.7521 + (Math.random() - 0.5) * 0.05;
            
            // Just update the object so it stays consistent on click
            if (!report.lat || !report.lng) {
              report.lat = lat;
              report.lng = lng;
            }

            const isSelected = selectedPin?.id === report.id;

            return (
              <Marker 
                key={report.id} 
                position={[lat, lng]} 
                icon={createCustomIcon(report, isSelected)}
                eventHandlers={{
                  click: () => {
                    setSelectedPin(report);
                    onSelectReport?.(report);
                  },
                }}
              >
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* ════ STATIC UI LAYER ════ */}
      <div className="relative z-10 p-4 pointer-events-none flex flex-col justify-between h-full">
        
        {/* Top Map Control Bar */}
        <div className="pointer-events-auto hidden md:flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-lg">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Peta Interaktif Surabaya
            </Badge>
            <span className="text-xs text-slate-400 font-medium">
              {reports.length} Laporan Terdaftar
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* MapTiler Style Switcher */}
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setMapTheme('dataviz-dark')}
                className={`px-2.5 py-1 rounded-md transition-colors ${mapTheme === 'dataviz-dark' ? 'bg-[#0057B8] text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                🌙 Dark
              </button>
              <button
                type="button"
                onClick={() => setMapTheme('streets-v2')}
                className={`px-2.5 py-1 rounded-md transition-colors ${mapTheme === 'streets-v2' ? 'bg-[#0057B8] text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                🗺️ Jalan
              </button>
              <button
                type="button"
                onClick={() => setMapTheme('satellite')}
                className={`px-2.5 py-1 rounded-md transition-colors ${mapTheme === 'satellite' ? 'bg-[#0057B8] text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                🛰️ Satelit
              </button>
            </div>
          </div>
        </div>

        {/* Selected Pin Popup Card — Model 3 Bottom Peek Card */}
        <div className="pointer-events-auto mt-24 md:mt-0 max-w-[92vw] sm:max-w-md md:max-w-lg mx-auto md:mx-0 w-full">
          {selectedPin && (() => {
            const isSlaBreached = selectedPin.slaDaysRemaining !== undefined && selectedPin.slaDaysRemaining <= 0;
            const isSwadaya = selectedPin.severity >= 9 || (selectedPin as any).isSwadaya || selectedPin.title.toLowerCase().includes('swadaya');

            let actionBtnClass = "bg-[#0057B8] hover:bg-[#004694] active:bg-[#003B73]";
            let actionBtnLabel = "Lihat Detail";

            if (isSlaBreached) {
              actionBtnClass = "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-rose-600/30";
              actionBtnLabel = "🚨 Buka Eskalasi & Viralkan";
            } else if (isSwadaya) {
              actionBtnClass = "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-amber-600/30";
              actionBtnLabel = "🤝 Ikut Patungan Warga";
            }

            return (
              <Card className="relative z-10 bg-slate-900/95 text-slate-100 border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200 select-none">
                <div className="flex items-start gap-3">
                  <img
                    src={selectedPin.photoUrl}
                    alt={selectedPin.title}
                    className="h-16 w-16 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] px-2 py-0.2">
                          {selectedPin.category}
                        </Badge>
                        <Badge className={`text-[10px] px-2 py-0.2 ${isSlaBreached ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
                          {isSlaBreached ? 'SLA Lewat' : `Keparahan: ${selectedPin.severity}/10`}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                        <ThumbsUp className="h-3 w-3 text-blue-400" />
                        <span>{selectedPin.upvotes}</span>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 line-clamp-1">
                      {selectedPin.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      📍 {selectedPin.address}
                    </p>
                  </div>
                </div>

                {/* Model 3: Bottom Peek Card Full-Width Contextual Action Button */}
                <Link href={`/laporan/${selectedPin.id}`} className="block w-full mt-3.5">
                  <button
                    type="button"
                    className={`w-full min-h-[44px] rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all touch-manipulation ${actionBtnClass}`}
                  >
                    <span>{actionBtnLabel}</span>
                  </button>
                </Link>
              </Card>
            );
          })()}
        </div>
      </div>
      
      {/* Required CSS to ensure Leaflet renders properly inside container */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container {
          background: transparent !important;
          isolation: isolate;
          z-index: 0 !important;
        }
        .custom-leaflet-marker {
          background: transparent;
          border: none;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
      `}} />
    </div>
  );
}
