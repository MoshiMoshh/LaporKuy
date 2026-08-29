import { AuthGuard } from '@/components/providers/auth-guard';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        {children}
      </div>
    </AuthGuard>
  );
}
