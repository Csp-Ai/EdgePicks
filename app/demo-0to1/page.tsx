export const revalidate = 0 as const;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import UpcomingGamesHero from '@/components/UpcomingGamesHero';
import AccuracySnapshot from '@/components/AccuracySnapshot';
import nextDynamic from 'next/dynamic';

const AgentFlowVisualizer = nextDynamic(() => import('@/components/AgentFlowVisualizer'), { ssr: false });

export default function Page() {
  return (
    <main className="p-4 space-y-6">
      <AgentFlowVisualizer />
      <UpcomingGamesHero />
      <AccuracySnapshot />
    </main>
  );
}

