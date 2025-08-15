'use client';

import { useApi } from '@/hooks/useApiData';
import type { Matchup } from '@/lib/types';
import { toNormalizedOdds } from '@/lib/odds/normalize';
import { toNum } from '@/lib/num';

export default function MatchupInsights() {
  const { data, error, isLoading } = useApi<Matchup[]>('/api/upcoming-games');

  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Loading upcoming games…</div>;
  if (error) return <div className="p-4 text-sm text-red-500">Failed to load games.</div>;
  if (!data?.length) return <div className="p-4 text-sm text-muted-foreground">No upcoming games.</div>;

  return (
    <div className="space-y-3">
      {data.map((g) => {
        const kickoff = new Date(g.time ?? Date.now());
        const odds = toNormalizedOdds(g.odds);
        const home = odds.homeSpread;
        const away = odds.awaySpread;
        const total = odds.total;
        return (
          <div key={g.id} className="rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                {g.awayTeam} @ {g.homeTeam}
              </div>
              <time className="text-sm text-muted-foreground">
                {kickoff.toLocaleString()}
              </time>
            </div>
            {(home !== undefined || away !== undefined || total !== undefined) && (
              <div className="mt-2 text-sm">
                Odds — Home: {home !== undefined ? toNum(home) : '—'} • Away:{' '}
                {away !== undefined ? toNum(away) : '—'}
                {total !== undefined ? ` • Total: ${toNum(total)}` : ''}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
