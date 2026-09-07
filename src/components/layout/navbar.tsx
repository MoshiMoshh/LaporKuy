'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/ui/logo';
import { useLaporKuyStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const mainNavLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/buat-laporan', label: 'Buat Laporan' },
  { href: '/dashboard', label: 'Peta & Lacak' },
  { href: '/transparansi', label: 'Transparansi SLA' },
  { href: '/papan-peringkat', label: 'Peringkat' },
  { href: '/misi', label: 'Misi & Poin' },
  { href: '/bantuan', label: 'Bantuan' },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { profile } = useLaporKuyStore();
  const isLoggedIn = true;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;
    if (mobileOpen) {
      gsap.to(menuRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
        display: 'block',
      });
    } else {
      gsap.to(menuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        display: 'none',
      });
    }
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b-[3px] border-primary shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={34} />
          <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider hidden sm:block">
            Layanan Pengaduan Publik
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-8 mr-auto" aria-label="Main navigation">
          {mainNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'text-primary border-b-2 border-primary -mb-[3px]'
                    : 'text-foreground/80 hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/profil"
              className="flex items-center gap-2.5 group p-1.5 rounded-md hover:bg-accent transition-colors"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {profile.name}
              </span>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" className="font-semibold px-6">
                Masuk
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="text-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className="md:hidden border-t border-border bg-card shadow-lg absolute w-full inset-x-0 z-50 overflow-hidden"
        style={{ height: 0, opacity: 0, display: 'none' }}
      >
        <div className="px-4 py-4 space-y-3">
          <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
            {mainNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 text-sm font-semibold rounded-md transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-accent'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Separator />

          {isLoggedIn ? (
            <Link
              href="/profil"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{profile.name}</span>
                <span className="text-xs text-muted-foreground">{profile.level}</span>
              </div>
            </Link>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button className="w-full font-semibold">
                Masuk
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
