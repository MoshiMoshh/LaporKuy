import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-background text-foreground dark:bg-slate-950 dark:text-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
