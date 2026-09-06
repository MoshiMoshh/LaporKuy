'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useLaporKuyStore } from '@/lib/store';
import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const mainNavLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/buat-laporan', label: 'Buat Laporan' },
  { href: '/dashboard', label: 'Peta & Lacak' },
  { href: '/transparansi', label: 'Transparansi SLA' },
  { href: '/papan-peringkat', label: 'Peringkat' },
  { href: '/misi', label: 'Misi & Poin' },
  { href: '/bantuan', label: 'Bantuan' },
];

const mobileMenuVariants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.25, ease: 'easeInOut' as const } },
  open:   { height: 'auto', opacity: 1, transition: { duration: 0.32, ease: 'easeOut' as const } },
};

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { profile } = useLaporKuyStore();
  const isLoggedIn = true;
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
      className="sticky top-0 z-50 w-full"
    >
      {/* Glass bar — transitions based on scroll */}
      <motion.div
        animate={isScrolled
          ? { backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px) saturate(160%)', boxShadow: '0 2px 16px 0 rgba(13,27,46,0.09)', borderBottomColor: 'rgba(255,255,255,0.30)' }
          : { backgroundColor: 'rgba(255,255,255,1)', backdropFilter: 'blur(0px) saturate(100%)', boxShadow: '0 1px 0 0 rgba(13,27,46,0.08)', borderBottomColor: 'rgba(13,27,46,0.08)' }
        }
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', WebkitBackdropFilter: isScrolled ? 'blur(16px) saturate(160%)' : 'none' }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Logo size={34} />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[11px] uppercase font-bold text-primary tracking-widest">LaporKuy</span>
              <span className="text-[9px] text-muted-foreground tracking-wider font-medium">Layanan Pengaduan Publik</span>
            </div>
          </Link>

          {/* Desktop Nav — pill links */}
          <nav className="hidden md:flex items-center gap-1 ml-8 mr-auto">
            {mainNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors duration-150 ${
                    isActive
                      ? 'text-primary bg-primary/8'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-xl bg-primary/10 -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/profil"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted/60 transition-colors touch-manipulation"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-8 w-8 rounded-xl object-cover border-2 border-border"
                />
                <span className="text-sm font-semibold text-foreground/80">
                  {profile.name}
                </span>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" className="rounded-xl font-semibold px-5 bg-primary hover:bg-primary/90 text-white shadow-sm">
                  Masuk
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: right side actions */}
          <div className="flex md:hidden items-center gap-2">
            {isLoggedIn && (
              <Link href="/profil" className="touch-manipulation">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-8 w-8 rounded-xl object-cover border-2 border-border"
                />
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors touch-manipulation"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <motion.div
                animate={mobileOpen ? 'open' : 'closed'}
                className="relative w-5 h-4 flex flex-col justify-between"
              >
                <motion.span
                  variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 7.5 } }}
                  className="block h-[2.5px] rounded-full bg-current origin-center transition-colors"
                />
                <motion.span
                  variants={{ closed: { opacity: 1, scaleX: 1 }, open: { opacity: 0, scaleX: 0 } }}
                  className="block h-[2.5px] rounded-full bg-current"
                />
                <motion.span
                  variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -7.5 } }}
                  className="block h-[2.5px] rounded-full bg-current origin-center"
                />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(13,27,46,0.08)',
              boxShadow: '0 8px 24px rgba(13,27,46,0.10)',
            }}
          >
            <nav className="px-4 pt-3 pb-4 space-y-0.5">
              {mainNavLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors touch-manipulation select-none ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/75 active:bg-muted/60'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="h-px bg-border/60 my-2" />

              {!isLoggedIn && (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-xl font-semibold h-12 bg-primary hover:bg-primary/90 text-white mt-1">
                    Masuk ke Akun
                  </Button>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
