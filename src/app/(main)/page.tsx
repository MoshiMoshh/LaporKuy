'use client';

import { useLaporKuyStore } from '@/lib/store';
import { HeroSection } from '@/components/home/hero-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';
import { RecentReportsSection } from '@/components/home/recent-reports-section';

export default function HomePage() {
  const { reports } = useLaporKuyStore();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 md:pb-0">
      <HeroSection />
      <HowItWorksSection />
      <RecentReportsSection reports={reports} />
    </div>
  );
}