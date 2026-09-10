'use client';

import { useEffect, useState } from 'react';
import { useUserLocation, requestUserLocation } from '@/lib/location-store';
import { MapPin, CheckCircle2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { location } = useUserLocation();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Automatically trigger GPS detection on startup
    requestUserLocation();

    // Check if permission prompt has been dismissed before
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('laporkuy_location_prompt_dismissed');
      if (!dismissed && !location.isGranted) {
        setShowPrompt(true);
      }
    }
  }, [location.isGranted]);

  // Sync detected location to Supabase Auth metadata and profiles table
  useEffect(() => {
    if (location.isGranted && location.fullLocation) {
      const supabase = createClient();
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          try {
            await supabase.auth.updateUser({
              data: {
                location: location.fullLocation,
                city: location.city,
                province: location.province,
                lat: location.lat,
                lng: location.lng,
              }
            });

            await supabase.from('profiles').update({
              location: location.fullLocation,
              city: location.city,
              district: location.city,
              province: location.province,
              lat: location.lat,
              lng: location.lng,
            }).eq('id', session.user.id);
          } catch {
            // Ignore background location sync errors
          }
        }
      });
    }
  }, [location.isGranted, location.fullLocation, location.city, location.province, location.lat, location.lng]);

  const handleEnableLocation = () => {
    requestUserLocation();
    setShowPrompt(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('laporkuy_location_prompt_dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('laporkuy_location_prompt_dismissed', 'true');
    }
  };

  return (
    <>
      {children}

      {/* Location Permission Prompt Modal/Banner */}
      {showPrompt && !location.isGranted && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-2 border-[#0057B8]/30 rounded-2xl shadow-2xl space-y-3 font-sans">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0057B8] dark:text-blue-400 border border-blue-100 shrink-0">
                <Navigation className="h-5 w-5 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Izin Akses Lokasi Diperlukan
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Mohon aktifkan akses lokasi (GPS) pada perangkat Anda agar sistem LaporKuy dapat menyajikan peta serta laporan infrastruktur secara akurat di wilayah Anda saat ini.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={handleEnableLocation}
                className="flex-1 h-9 text-xs font-bold bg-[#0057B8] hover:bg-[#004494] text-white rounded-xl shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                Aktifkan Lokasi Presisi
              </Button>
              <Button
                variant="ghost"
                onClick={handleDismiss}
                className="h-9 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded-xl px-3"
              >
                Nanti
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
