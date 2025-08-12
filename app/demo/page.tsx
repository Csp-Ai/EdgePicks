import { Suspense } from 'react';
import { SWRConfig } from 'swr';
import UpcomingGamesHero from '@/components/UpcomingGamesHero';
import DemoMatchupCarousel from '@/components/DemoMatchupCarousel';
import LoadingShimmer from '@/components/LoadingShimmer';
import UnifiedDemoLayout from '@/components/layouts/UnifiedDemoLayout';
import LeagueSection from '@/components/LeagueSection';
import AccuracySnapshot from '@/components/AccuracySnapshot';
import { fetchUpcomingGames } from '@/lib/data';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 300; // 5 minutes

interface DemoPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DemoPage({ searchParams }: DemoPageProps) {
  // Pre-fetch upcoming games for initial render
  const upcoming = await fetchUpcomingGames();

  const league = typeof searchParams?.league === 'string' ? searchParams.league : 'ALL';
  const viewType = typeof searchParams?.view === 'string' ? searchParams.view : 'list';

  return (
    <SWRConfig value={{ fallback: { '/api/upcoming-games': upcoming } }}>
      <UnifiedDemoLayout>
        {/* Hero section with quick stats */}
        <UpcomingGamesHero />

        {/* Dynamic content section */}
        <section className="space-y-6">
          {viewType === 'carousel' ? (
            <DemoMatchupCarousel />
          ) : (
            <Suspense fallback={<LoadingShimmer />}>
              <LeagueSection 
                league={league} 
                showPredictions
              />
            </Suspense>
          )}
        </section>

        {/* Accuracy snapshot component */}
        <AccuracySnapshot />
      </UnifiedDemoLayout>
    </SWRConfig>
  );
}
