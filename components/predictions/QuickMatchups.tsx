'use client';
import { useUpcomingGames } from '@/hooks/useUpcomingGames';
import { safeLocalDate } from '@/lib/normalize';

export default function QuickMatchups() {
  const { data, error, isLoading } = useUpcomingGames();

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading games…</div>;
  if (error) return <div className="text-sm text-red-500">Failed to load games.</div>;
  if (!data?.length) return <div className="text-sm text-muted-foreground">No upcoming games found.</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 min-w-full">
        {data.map(g => (
          <article key={g.id} className="min-w-[260px] rounded-xl border p-4 hover:bg-accent/40 transition">
            <div className="text-sm text-muted-foreground">{safeLocalDate(g.kickoff)}</div>
            <div className="mt-1 font-medium">
              {g.awayTeam || 'TBD'} @ {g.homeTeam || 'TBD'}
            </div>
            {g.odds && (g.odds.home != null || g.odds.away != null) && (
              <div className="mt-2 text-sm">
                {g.odds.home != null ? `Home: ${g.odds.home}` : 'Home: —'} • {g.odds.away != null ? `Away: ${g.odds.away}` : 'Away: —'}
                {g.odds.draw != null ? ` • Draw: ${g.odds.draw}` : ''}
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
