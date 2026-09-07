'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Plus, Bell, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLaporKuyStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  isPrimary?: boolean;
  hasBadge?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/buat-laporan', label: 'Lapor', icon: Plus, isPrimary: true },
  { href: '/notifikasi', label: 'Notifikasi', icon: Bell, hasBadge: true },
  { href: '/profil', label: 'Profil', icon: User },
];


export function BottomNav() {
  const pathname = usePathname();
  const { notifications } = useLaporKuyStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40" aria-label="Mobile navigation">
      <div className="bg-card/95 backdrop-blur-lg px-1 pb-[env(safe-area-inset-bottom)] border-t border-border shadow-[0_-1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-end justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            /* ── FAB (Primary Action) ── */
            if (item.isPrimary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className="relative -top-4 flex items-center justify-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(0,87,184,0.4)] ring-4 ring-card active:scale-95 transition-transform">
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                </Link>
              );
            }

            /* ── Regular Nav Item ── */
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-0.5 py-2 w-16 text-[10px] font-semibold tracking-wide transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground active:text-foreground'
                )}
              >
                <Icon
                  className={cn('h-[22px] w-[22px] transition-transform', isActive && 'scale-110')}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span>{item.label}</span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-0 h-[3px] w-5 rounded-full bg-primary" />
                )}

                {/* Notification badge */}
                {item.hasBadge && unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-0.5 left-[calc(50%+4px)] h-4 min-w-4 px-1 text-[9px] font-bold justify-center rounded-full shadow-sm"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
