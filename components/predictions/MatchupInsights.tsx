'use client';

import { useApi } from '@/hooks/useApiData';
import type { UpcomingGame } from '@/lib/types';

export default function MatchupInsights() {
  const { data, error, isLoading } = useApi<UpcomingGame[]>('/api/upcoming-games');

  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Loading upcoming games…</div>;
  if (error) return <div className="p-4 text-sm text-red-500">Failed to load games.</div>;
  if (!data?.length) return <div className="p-4 text-sm text-muted-foreground">No upcoming games.</div>;

  return (
    <div className="space-y-3">
      {data.map((g) => (
        <div key={g.id} className="rounded-2xl border p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">
              {g.awayTeam} @ {g.homeTeam}
            </div>
            <time className="text-sm text-muted-foreground">
              {new Date(g.kickoff).toLocaleString()}
            </time>
          </div>
          {g.odds && (
            <div className="mt-2 text-sm">
              Odds — Home: {g.odds.home} • Away: {g.odds.away}
              {g.odds.draw != null ? ` • Draw: ${g.odds.draw}` : ''}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
