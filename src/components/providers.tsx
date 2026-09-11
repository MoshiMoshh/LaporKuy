"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LaporKuyStoreProvider } from "@/lib/store";
import dynamic from "next/dynamic";

const LocationProvider = dynamic(
  () => import("@/components/providers/location-provider").then(mod => mod.LocationProvider),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LaporKuyStoreProvider>
          <LocationProvider>
            {children}
          </LocationProvider>
        </LaporKuyStoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
