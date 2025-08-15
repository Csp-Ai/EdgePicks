import React from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import LoadingShimmer from './LoadingShimmer';

export type GameInsightsHeroProps = {
  games?: Array<{
    id: string;
    home: string;
    away: string;
    kickoff: string; // ISO
    spread?: number | null;
    total?: number | null;
    homeLogoUrl?: string;
    awayLogoUrl?: string;
  }>;
  isLoading?: boolean;
  onSeeAgents?: () => void; // opens Matchup Insights with Advanced View
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch upcoming games');
  }
  return res.json();
};

const GameInsightsHero: React.FC<GameInsightsHeroProps> = ({
  games: gamesProp,
  isLoading: loadingProp,
  onSeeAgents,
}) => {
  const { data, error, isLoading: swrLoading } = useSWR<GameInsightsHeroProps['games']>(
    gamesProp ? null : '/api/upcoming-games',
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 },
  );

  const games = gamesProp ?? data ?? [];
  const isLoading = loadingProp ?? (gamesProp ? false : swrLoading);

  const formatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

  if (isLoading) {
    return (
      <section aria-label="Upcoming games" className="p-4">
        <LoadingShimmer lines={6} lineClassName="h-16" />
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label="Upcoming games" className="p-4 text-center space-y-4">
        <p>Failed to load upcoming games.</p>
        {onSeeAgents && (
          <button
            onClick={onSeeAgents}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            See agents in action
          </button>
        )}
      </section>
    );
  }

  if (!games.length) {
    return (
      <section aria-label="Upcoming games" className="p-4 text-center space-y-4">
        <p>No upcoming games.</p>
        {onSeeAgents && (
          <button
            onClick={onSeeAgents}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            See agents in action
          </button>
        )}
      </section>
    );
  }

  return (
    <section
      aria-labelledby="game-insights-heading"
      className="p-4 space-y-4"
    >
      <h2 id="game-insights-heading" className="text-xl font-semibold">
        Upcoming Games
      </h2>
      <ul className="space-y-3">
        {games.slice(0, 6).map((g) => (
          <li
            key={g.id}
            data-testid="game-item"
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              {g.homeLogoUrl && (
                <Image
                  src={g.homeLogoUrl}
                  alt={`${g.home} logo`}
                  className="w-6 h-6"
                  width={24}
                  height={24}
                />
              )}
              <span>{g.home}</span>
              <span className="text-gray-500">vs</span>
              {g.awayLogoUrl && (
                <Image
                  src={g.awayLogoUrl}
                  alt={`${g.away} logo`}
                  className="w-6 h-6"
                  width={24}
                  height={24}
                />
              )}
              <span>{g.away}</span>
            </div>
            <div className="text-right text-sm">
              <time dateTime={g.kickoff}>{formatter.format(new Date(g.kickoff))}</time>
              {(g.spread != null || g.total != null) && (
                <div>
                  {g.spread != null && <span>Spread {g.spread}</span>}
                  {g.spread != null && g.total != null && <span> · </span>}
                  {g.total != null && <span>Total {g.total}</span>}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {onSeeAgents && (
        <div>
          <button
            onClick={onSeeAgents}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded"
          >
            See agents in action
          </button>
        </div>
      )}
    </section>
  );
};

export default GameInsightsHero;

