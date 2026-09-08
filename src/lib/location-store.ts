'use client';

import { useState, useEffect } from 'react';

export interface UserLocationState {
  city: string;
  province: string;
  fullLocation: string;
  lat: number;
  lng: number;
  isGranted: boolean;
  isLoading: boolean;
}

const DEFAULT_LOCATION: UserLocationState = {
  city: 'Surabaya',
  province: 'Jawa Timur',
  fullLocation: 'Surabaya, Jawa Timur',
  lat: -7.2575,
  lng: 112.7521,
  isGranted: false,
  isLoading: true,
};

let globalLocation: UserLocationState = DEFAULT_LOCATION;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export async function requestUserLocation() {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    globalLocation = { ...globalLocation, isLoading: false };
    notify();
    return;
  }

  globalLocation = { ...globalLocation, isLoading: true };
  notify();

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
          { headers: { 'Accept-Language': 'id' } }
        );
        const data = await res.json();

        if (data && data.address) {
          const addr = data.address;
          const city = addr.city || addr.town || addr.county || addr.city_district || 'Kota';
          const province = addr.state || addr.region || 'Jawa Timur';

          globalLocation = {
            city,
            province,
            fullLocation: `${city}, ${province}`,
            lat,
            lng,
            isGranted: true,
            isLoading: false,
          };

          try {
            localStorage.setItem('laporkuy_user_location', JSON.stringify(globalLocation));
          } catch (e) {}

          notify();
          return;
        }
      } catch (err) {
        console.warn('Reverse geocoding location error:', err);
      }

      globalLocation = {
        city: 'Surabaya',
        province: 'Jawa Timur',
        fullLocation: 'Surabaya, Jawa Timur',
        lat,
        lng,
        isGranted: true,
        isLoading: false,
      };
      notify();
    },
    (err) => {
      console.warn('Location permission denied or error:', err);
      globalLocation = { ...globalLocation, isGranted: false, isLoading: false };
      notify();
    },
    { timeout: 8000, enableHighAccuracy: true }
  );
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocationState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('laporkuy_user_location');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {}
    }
    return globalLocation;
  });

  useEffect(() => {
    const handler = () => setLocation(globalLocation);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return { location, requestUserLocation };
}
