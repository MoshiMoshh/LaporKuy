'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Plus, Bell, User } from 'lucide-react';
import { useLaporKuyStore } from '@/lib/store';
import { motion } from 'framer-motion';

const links = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/dashboard', label: 'Peta', icon: LayoutDashboard },
  { href: '/buat-laporan', label: 'Lapor', icon: Plus, isPrimary: true },
  { href: '/notifikasi', label: 'Notifikasi', icon: Bell, hasBadge: true },
  { href: '/profil', label: 'Profil', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { notifications } = useLaporKuyStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 select-none pointer-events-none">
      {/* Modern Floating Squircle Dock */}
      <div
        className="pointer-events-auto mx-auto max-w-md rounded-[1.75rem] px-2 py-1.5 flex items-center justify-around relative border border-white/70 dark:border-white/15 shadow-[0_12px_36px_rgba(13,27,46,0.14)]"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        {links.map((link) => {
          const isActive = pathname === link.href;
          const badgeCount = link.hasBadge ? unreadCount : 0;

          // Center Orange Report Squircle Button (Persegi Modern)
          if (link.isPrimary) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center -mt-7 relative z-10 touch-manipulation group"
                aria-label="Buat Laporan Baru"
              >
                <motion.div
                  whileTap={{ scale: 0.90 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-md border-t border-white/40 touch-manipulation"
                  style={{
                    background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                    boxShadow: '0 8px 24px rgba(249,115,22,0.45), inset 0 1px 0 rgba(255,255,255,0.40)',
                  }}
                >
                  <Plus className="h-7 w-7 text-white stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
                </motion.div>
                <span className="text-[10px] font-black mt-1 text-orange-600 tracking-tight">
                  {link.label}
                </span>
              </Link>
            );
          }

          // Regular Navigation Tabs — Squircle Tiles (Persegi)
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex flex-col items-center justify-center touch-manipulation select-none"
              aria-label={link.label}
            >
              <motion.div
                whileTap={{ scale: 0.90 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-150 ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <link.icon
                  className={`h-5 w-5 transition-all duration-150 ${
                    isActive ? 'text-primary scale-105' : 'text-muted-foreground'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[9px] font-bold mt-0.5 tracking-tight transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {link.label}
                </span>

                {/* Badge if any */}
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-urgent text-[8px] font-extrabold text-white shadow-sm border-2 border-white">
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
