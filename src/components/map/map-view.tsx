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
        >
          <TileLayer
            attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={getTileUrl()}
          />
          
          <MapController selectedPin={selectedPin} />

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
      
      {/* Required CSS to ensure Leaflet renders properly inside container */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container {
          background: transparent !important;
        }
        .custom-leaflet-marker {
          background: transparent;
          border: none;
        }
      `}} />
    </div>
  );
}
