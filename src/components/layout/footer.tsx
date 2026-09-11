import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Buat Laporan", href: "/buat-laporan" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Leaderboard", href: "/papan-peringkat" },
    ],
  },
  {
    title: "Informasi",
    links: [
      { label: "Cara Kerja", href: "/#cara-kerja" },
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Kebijakan Privasi", href: "/privasi" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "FAQ", href: "/bantuan" },
      { label: "Kontak", href: "/bantuan" },
      { label: "Laporkan Bug", href: "/bantuan" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <Logo size={32} />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Platform pelaporan masalah infrastruktur kota.
              Bantu wujudkan kota yang lebih baik untuk semua warga.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LaporKuy. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-muted-foreground">
            Dibuat untuk Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
