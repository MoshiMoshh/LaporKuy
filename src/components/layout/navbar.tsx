'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useLaporKuyStore } from '@/lib/store';
import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { PlusSquare, Plus, User, Menu, X } from 'lucide-react';

const mainNavLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/dashboard', label: 'Peta & Lacak' },
  { href: '/transparansi', label: 'Transparansi SLA' },
  { href: '/papan-peringkat', label: 'Peringkat' },
  { href: '/misi', label: 'Misi & Poin' },
  { href: '/bantuan', label: 'Bantuan' },
];

const mobileMenuVariants = {
  closed: { height: 0, opacity: 0, scale: 0.98, transition: { duration: 0.22, ease: 'easeInOut' as const } },
  open:   { height: 'auto', opacity: 1, scale: 1, transition: { duration: 0.28, ease: 'easeOut' as const } },
};

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { profile } = useLaporKuyStore();
  const isLoggedIn = true;
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 16);
  });

  return (
    <div className="sticky top-2 sm:top-4 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all duration-300">
      {/* Floating Island Glass Navbar Dock */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className={`w-full rounded-2xl sm:rounded-3xl transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-slate-900/90 shadow-[0_12px_36px_rgba(13,27,46,0.12)] border border-white/60 dark:border-white/15'
            : 'bg-white/80 dark:bg-slate-900/80 shadow-[0_6px_24px_rgba(13,27,46,0.06)] border border-white/40 dark:border-white/10'
        }`}
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div className="flex h-16 items-center justify-between px-3.5 sm:px-5">

          {/* Logo & Civic Badge */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 select-none group">
            <div className="group-hover:scale-105 transition-transform duration-200">
              <Logo size={32} />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-xs font-black text-foreground tracking-tight flex items-center gap-1">
                LaporKuy
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-primary/10 text-primary uppercase">
                  Publik
                </span>
              </span>
              <span className="text-[9px] text-muted-foreground tracking-wider font-semibold mt-0.5">
                Pengaduan Infrastruktur
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items — Squircle Touch Tiles */}
          <nav className="hidden lg:flex items-center gap-1.5 mx-4">
            {mainNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-xs sm:text-[13px] font-bold rounded-xl transition-all duration-150 select-none touch-manipulation ${
                    isActive
                      ? 'text-primary bg-primary/10 shadow-xs'
                      : 'text-foreground/75 hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-squircle-active"
                      className="absolute inset-0 rounded-xl bg-primary/10 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 36 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions — Signature Orange Report Button & Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Orange Report Action Button */}
            <Link href="/buat-laporan">
              <Button
                variant="liquid-primary"
                size="default"
                className="h-11 px-5 rounded-2xl font-extrabold text-xs sm:text-sm tracking-wide shadow-md flex items-center gap-2 touch-manipulation group"
              >
                <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
                <span>Buat Laporan</span>
              </Button>
            </Link>

            {/* Profile Squircle Tile */}
            {isLoggedIn ? (
              <Link
                href="/profil"
                className="h-11 w-11 rounded-2xl flex items-center justify-center p-0.5 border border-border/80 hover:border-primary/50 bg-card hover:bg-muted/40 shadow-xs active:scale-95 transition-all touch-manipulation"
                title="Profil Pengguna"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full rounded-[14px] object-cover"
                />
              </Link>
            ) : (
              <Link href="/login">
                <Button size="default" variant="outline" className="rounded-2xl font-bold text-xs h-11 px-4 border-border">
                  Masuk
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Right Bar: Orange Square + Quick Action & Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Square Orange Action Button for Mobile */}
            <Link href="/buat-laporan" aria-label="Buat Laporan Baru">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all touch-manipulation border-t border-white/30">
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
            </Link>

            {/* Square Profile Tile for Mobile */}
            {isLoggedIn && (
              <Link href="/profil" className="touch-manipulation">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-border p-0.5 bg-card active:scale-95 transition-transform">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full rounded-[10px] object-cover"
                  />
                </div>
              </Link>
            )}

            {/* Square Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 rounded-xl bg-muted/70 hover:bg-muted text-foreground flex items-center justify-center active:scale-95 transition-all touch-manipulation border border-border/50"
              aria-label="Menu Navigasi"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </motion.div>

      {/* Mobile Menu Dropdown — Floating Squircle Card */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-menu-card"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="sm:hidden mt-2 rounded-3xl overflow-hidden border border-white/60 dark:border-white/15 shadow-[0_12px_40px_rgba(13,27,46,0.16)]"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            }}
          >
            <div className="p-3.5 space-y-2">
              {/* Primary Mobile Orange CTA Button in Drawer */}
              <Link
                href="/buat-laporan"
                onClick={() => setMobileOpen(false)}
                className="block mb-2"
              >
                <div className="w-full h-12 rounded-2xl bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 text-white flex items-center justify-center gap-2 font-extrabold text-sm shadow-md active:scale-98 transition-all touch-manipulation border-t border-white/40">
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Buat Laporan Kerusakan</span>
                </div>
              </Link>

              {/* Navigation Links — Squircle Tiles */}
              <nav className="space-y-1">
                {mainNavLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all touch-manipulation select-none ${
                        isActive
                          ? 'bg-primary/10 text-primary shadow-xs'
                          : 'text-foreground/80 active:bg-muted/60'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="h-px bg-border/60 my-2" />

              {/* Profile or Login */}
              {isLoggedIn ? (
                <Link
                  href="/profil"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-muted/60 text-xs font-bold text-foreground touch-manipulation"
                >
                  <div className="w-8 h-8 rounded-xl overflow-hidden border border-border shrink-0">
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-foreground font-bold">{profile.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Buka Profil & Laporan Saya</p>
                  </div>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-2xl font-bold h-12 bg-primary text-white mt-1">
                    Masuk ke Akun
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
