import { AuthGuard } from '@/components/providers/auth-guard';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen w-full flex flex-col">
        {children}
      </div>
    </AuthGuard>
  );
}
