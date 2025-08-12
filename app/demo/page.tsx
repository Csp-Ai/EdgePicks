import { Suspense } from 'react';
import { SWRConfig } from 'swr';
import DemoHero from '@/components/demo/DemoHero';
import UpcomingGamesPanel from '@/components/UpcomingGamesPanel';
import DemoMatchupCarousel from '@/components/DemoMatchupCarousel';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchUpcomingGames } from '@/lib/data';

export const runtime = 'edge';
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
    <main className="flex flex-col min-h-screen bg-gray-50">
      <DemoHero />
      
      <SWRConfig value={{ fallback: { '/api/upcoming-games': upcoming } }}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-2xl font-bold mb-6">
                Live Agent Predictions
              </h2>
              
              <Suspense fallback={<LoadingShimmer />}>
                {viewType === 'carousel' ? (
                  <DemoMatchupCarousel />
                ) : (
                  <UpcomingGamesPanel 
                    maxVisible={3} 
                    league={league}
                  />
                )}
              </Suspense>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                Agent Analysis Stats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">94%</div>
                  <div className="text-sm text-gray-600">Agent Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">127</div>
                  <div className="text-sm text-gray-600">Games Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-gray-600">Active Agents</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </SWRConfig>
    </main>
  );
}
