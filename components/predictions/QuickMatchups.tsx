'use client';
import { useUpcomingGames } from '@/hooks/useUpcomingGames';
import { safeLocalDate } from '@/lib/normalize';
import { toNormalizedOdds } from '@/lib/odds/normalize';
import { toNum } from '@/lib/num';

export default function QuickMatchups() {
  const { data, error, isLoading } = useUpcomingGames();

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading games…</div>;
  if (error) return <div className="text-sm text-red-500">Failed to load games.</div>;
  if (!data?.length) return <div className="text-sm text-muted-foreground">No upcoming games found.</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 min-w-full">
        {data.map(g => {
          const odds = toNormalizedOdds(g.odds);
          return (
            <article key={g.id} className="min-w-[260px] rounded-xl border p-4 hover:bg-accent/40 transition">
              <div className="text-sm text-muted-foreground">{safeLocalDate(g.time)}</div>
              <div className="mt-1 font-medium">
                {g.awayTeam || 'TBD'} @ {g.homeTeam || 'TBD'}
              </div>
              {(odds.homeSpread !== undefined || odds.awaySpread !== undefined || odds.total !== undefined) && (
                <div className="mt-2 text-sm">
                  Home: {odds.homeSpread !== undefined ? toNum(odds.homeSpread) : '—'} • Away: {odds.awaySpread !== undefined ? toNum(odds.awaySpread) : '—'}
                  {odds.total !== undefined ? ` • Total: ${toNum(odds.total)}` : ''}
                </div>
              )}
              <a href={`/predictions?gameId=${encodeURIComponent(g.id)}`} className="mt-3 inline-flex text-sm text-primary hover:underline">
                View insights →
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
