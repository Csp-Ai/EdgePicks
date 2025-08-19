import { Suspense } from 'react';
import { SWRConfig } from 'swr';
import nextDynamic from 'next/dynamic';
import UpcomingGamesHero from '@/components/UpcomingGamesHero';
import LoadingShimmer from '@/components/LoadingShimmer';
import UnifiedDemoLayout from '@/components/layouts/UnifiedDemoLayout';
import LeagueSection from '@/components/LeagueSection';
import { fetchUpcomingGames } from '@/lib/data';
export const revalidate = 300;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
// Lazy heavy visual components
const DemoMatchupCarousel = nextDynamic(() => import('@/components/DemoMatchupCarousel'), { ssr: false });
const AccuracySnapshot = nextDynamic(() => import('@/components/AccuracySnapshot'), { ssr: false });

export default async function DemoPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const upcoming = await fetchUpcomingGames();
  const league = typeof searchParams?.league === 'string' ? searchParams.league : 'ALL';
  const viewType = typeof searchParams?.view === 'string' ? searchParams.view : 'list';

  return (
    <SWRConfig value={{ fallback: { '/api/upcoming-games': upcoming } }}>
      <UnifiedDemoLayout>
        <UpcomingGamesHero />
        <section className="space-y-6">
          {viewType === 'carousel' ? (
            <DemoMatchupCarousel />
          ) : (
            <Suspense fallback={<LoadingShimmer />}>
              <LeagueSection league={league} showPredictions />
            </Suspense>
          )}
        </section>
        {/* Only render once visible (AccuracySnapshot is chart-heavy) */}
        <section className="min-h-[280px]" data-defer="visible">
          <AccuracySnapshot />
        </section>
      </UnifiedDemoLayout>
    </SWRConfig>
  );
}
