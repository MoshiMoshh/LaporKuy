'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, PlusCircle, Bell, User } from 'lucide-react';
import { useLaporKuyStore } from '@/lib/store';

export function BottomNav() {
  const pathname = usePathname();
  const { notifications } = useLaporKuyStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const links = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/buat-laporan', label: 'Lapor', icon: PlusCircle, isPrimary: true },
    { href: '/notifikasi', label: 'Notifikasi', icon: Bell, badge: unreadCount },
    { href: '/profil', label: 'Profil', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full select-none">
      <div className="bg-background px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-border relative">
        
        {links.map((link) => {
          const isActive = pathname === link.href;

          if (link.isPrimary) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center -mt-9 relative z-10 group px-2 touch-manipulation"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-90 transition-transform border-4 border-background">
                  <PlusCircle className="h-7 w-7" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center py-1 min-h-[44px] min-w-[56px] text-[10px] font-semibold transition-all duration-150 touch-manipulation active:scale-95 active:opacity-80 select-none ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
            >
              <link.icon className={`h-5 w-5 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={isActive ? 'opacity-100 font-bold' : 'opacity-75'}>{link.label}</span>

              {link.badge && link.badge > 0 ? (
                <span className="absolute top-0.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white shadow-sm">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
