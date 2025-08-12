'use client';
import { useApi } from '@/hooks/useApiData';
import type { UpcomingGame } from '@/lib/types';

export default function QuickMatchups() {
  const { data, error, isLoading } = useApi<UpcomingGame[]>('/api/upcoming-games');

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading games…</div>;
  if (error) return <div className="text-sm text-red-500">Failed to load games.</div>;
  if (!data?.length) return <div className="text-sm text-muted-foreground">No upcoming games found.</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 min-w-full">
        {data.map(g => (
          <article key={g.id} className="min-w-[260px] rounded-xl border p-4 hover:bg-accent/40 transition">
            <div className="text-sm text-muted-foreground">{new Date(g.kickoff).toLocaleString()}</div>
            <div className="mt-1 font-medium">{g.awayTeam} @ {g.homeTeam}</div>
            {g.odds && (
              <div className="mt-2 text-sm">
                Home: {g.odds.home} • Away: {g.odds.away}{g.odds.draw != null ? ` • Draw: ${g.odds.draw}` : ''}
              </div>
            )}
            <a href={`/predictions?gameId=${encodeURIComponent(g.id)}`} className="mt-3 inline-flex text-sm text-primary hover:underline">
              View insights →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
