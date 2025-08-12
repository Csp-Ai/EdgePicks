'use client';

import { Suspense } from 'react';
import { SWRConfig } from 'swr';
import SportsSidebar from '../SportsSidebar';
import LeagueSection from '../LeagueSection';
import AgentAnalysisPanel from '../AgentAnalysisPanel';
import LoadingShimmer from '@/components/LoadingShimmer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useLeagues } from '@/hooks/useLeagues';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type UnifiedDemoLayoutProps = {
  defaultLeague?: string;
  children: React.ReactNode;
};

export default function UnifiedDemoLayout({ 
  defaultLeague = 'NFL',
  children 
}: UnifiedDemoLayoutProps) {
  const { leagues, activeLeague, setActiveLeague } = useLeagues(defaultLeague);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar - Sports Selection */}
      <SportsSidebar 
        leagues={leagues}
        activeLeague={activeLeague}
        onLeagueChange={setActiveLeague}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        <Tabs defaultValue="games" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="games">Live Games</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="games" className="space-y-6">
            <ErrorBoundary>
              <Suspense fallback={<LoadingShimmer />}>
                <LeagueSection 
                  league={activeLeague}
                  showPredictions
                />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <ErrorBoundary>
              <Suspense fallback={<LoadingShimmer />}>
                <AgentAnalysisPanel />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Trends content */}
          </TabsContent>
        </Tabs>

        {children}
      </main>

      {/* Right Sidebar - Active Predictions */}
      <aside className="w-80 border-l border-gray-200 dark:border-gray-800 p-4 hidden lg:block">
        <h3 className="font-semibold mb-4">Active Predictions</h3>
        <Suspense fallback={<div>Loading predictions...</div>}>
          <AgentAnalysisPanel compact />
        </Suspense>
      </aside>
    </div>
  );
}
