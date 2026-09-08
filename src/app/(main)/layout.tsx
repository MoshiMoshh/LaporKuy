import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AuthGuard } from "@/components/providers/auth-guard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col pb-28 md:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
