'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLaporKuyStore } from '@/lib/store';
import { useState } from 'react';

// ==========================================
// CUSTOM VISUAL SVG ICON COMPONENTS (PREMIUM ACCENT)
// ==========================================

const LaporKuyLogo = ({ className = "h-10 w-10" }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M50 8C50 8 85 21 85 49.5c0 23.1-23 37.8-35 42.5C38 87.3 15 72.6 15 49.5 15 21 50 8 50 8z" 
      fill="#0057B8" 
    />
    <path 
      d="M36 49.5l10.5 10.5 19.5-19.5" 
      stroke="white" 
      strokeWidth="11" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);


const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const mainNavLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/buat-laporan', label: 'Buat Pengaduan' },
  { href: '/dashboard', label: 'Lacak Laporan' },
  { href: '/bantuan', label: 'Informasi' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { profile } = useLaporKuyStore();
  const isLoggedIn = true; // In real app, check auth status

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-[3px] border-[#0057B8] shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Pemerintahan */}
        <Link href="/" className="flex items-center gap-3">
          <LaporKuyLogo className="h-10 w-10 shrink-0" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#003B73] leading-tight">
              Portal LaporKuy
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              Layanan Pengaduan Publik
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 ml-8 mr-auto">
          {mainNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-[#0057B8] border-b-2 border-[#0057B8] py-5 -mb-[3px]'
                    : 'text-[#172033] hover:text-[#0057B8] py-5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link href="/profil" className="flex items-center gap-2 group p-1.5 rounded hover:bg-slate-50">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-7 w-7 rounded object-cover border border-[#D9DEE5]"
              />
              <span className="text-sm font-semibold text-[#172033] group-hover:text-[#0057B8] transition-colors">
                {profile.name}
              </span>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="rounded-md font-semibold px-6 shadow-none bg-[#0057B8] hover:bg-[#003B73] text-white">
                Masuk
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#172033]"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#D9DEE5] bg-white px-4 py-4 space-y-4 shadow-lg absolute w-full left-0 right-0 z-50">
          <nav className="flex flex-col gap-2">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-[#172033] rounded hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="h-px bg-[#D9DEE5]" />
          {isLoggedIn ? (
            <Link
              href="/profil"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2"
            >
              <UserIcon className="h-5 w-5 text-[#172033]" />
              <span className="text-sm font-semibold text-[#172033]">Profil Saya</span>
            </Link>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button className="w-full rounded font-semibold shadow-none bg-[#0057B8] hover:bg-[#003B73]">
                Masuk
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
