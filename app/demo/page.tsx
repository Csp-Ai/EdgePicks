import { Suspense } from 'react';
import { SWRConfig } from 'swr';
import DemoHero from '@/components/demo/DemoHero';
import DemoMatchupCarousel from '@/components/DemoMatchupCarousel';
import LoadingShimmer from '@/components/LoadingShimmer';
import UnifiedDemoLayout from '@/components/layouts/UnifiedDemoLayout';
import LeagueSection from '@/components/LeagueSection';
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
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">94%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Agent Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">127</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Games Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Agents</div>
            </div>
          </div>
        </section>

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
      </UnifiedDemoLayout>
    </SWRConfig>
  );
}
