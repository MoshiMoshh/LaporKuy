'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, PlusSquare, Bell, User } from 'lucide-react';
import { useLaporKuyStore } from '@/lib/store';
import { motion } from 'framer-motion';

const links = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/dashboard', label: 'Peta', icon: LayoutDashboard },
  { href: '/buat-laporan', label: 'Lapor', icon: PlusSquare, isPrimary: true },
  { href: '/notifikasi', label: 'Notifikasi', icon: Bell, hasBadge: true },
  { href: '/profil', label: 'Profil', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { notifications } = useLaporKuyStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full select-none">
      <div
        className="px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-around relative"
        style={{
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: '1px solid rgba(13,27,46,0.08)',
          boxShadow: '0 -4px 24px rgba(13,27,46,0.07)',
        }}
      >
        {links.map((link) => {
          const isActive = pathname === link.href;
          const badgeCount = link.hasBadge ? unreadCount : 0;

          if (link.isPrimary) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center -mt-8 relative z-10 touch-manipulation"
                aria-label={link.label}
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-float touch-manipulation"
                  style={{
                    background: 'linear-gradient(145deg, #2563EB 0%, #1A56DB 60%, #1045B8 100%)',
                    boxShadow: '0 6px 20px rgba(26,86,219,0.40), inset 0 1px 0 rgba(255,255,255,0.20)',
                  }}
                >
                  <link.icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                </motion.div>
                <span className="text-[10px] font-semibold mt-1 text-primary">{link.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex flex-col items-center justify-center py-1 min-h-[52px] min-w-[60px] touch-manipulation select-none"
              aria-label={link.label}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                className="flex flex-col items-center gap-1"
              >
                {/* Active pill indicator */}
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-pill"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-[3px] w-5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}

                <link.icon
                  className={`h-5 w-5 transition-all duration-150 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {link.label}
                </span>
              </motion.div>

              {badgeCount > 0 && (
                <span className="absolute top-0.5 right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-urgent text-[9px] font-bold text-white shadow-sm">
                  {badgeCount > 9 ? '9+' : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
