import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0057B8" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

const interFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LaporKuy — Platform Pelaporan Infrastruktur Kota Berbasis AI",
    template: "%s | LaporKuy",
  },
  description:
    "Laporkan masalah infrastruktur kota dalam 30 detik. Foto + lokasi otomatis, AI klasifikasi, teruskan ke dinas terkait. Bantu wujudkan kota yang lebih baik.",
  keywords: [
    "lapor",
    "infrastruktur",
    "jalan rusak",
    "lampu mati",
    "sampah",
    "banjir",
    "AI",
    "pelaporan kota",
  ],
  openGraph: {
    title: "LaporKuy — Platform Pelaporan Infrastruktur Kota Berbasis AI",
    description:
      "Laporkan masalah infrastruktur kota dalam 30 detik. AI klasifikasi otomatis.",
    siteName: "LaporKuy",
    type: "website",
    locale: "id_ID",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${interFont.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-background text-foreground dark:bg-slate-950 dark:text-slate-50 font-sans">
        <Providers>{children}</Providers>
          <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
