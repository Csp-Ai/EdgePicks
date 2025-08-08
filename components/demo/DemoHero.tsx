import React from 'react';
import useSWR from 'swr';
import GameInsightsHero from '../GameInsightsHero';

interface DemoHeroProps {
  onStart?: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DemoHero: React.FC<DemoHeroProps> = ({ onStart }) => {
  const { data, isLoading } = useSWR<any[]>(
    '/api/upcoming-games',
    fetcher,
    { revalidateOnFocus: false },
  );

  const games = (data || []).map((g: any) => ({
    id: g.gameId,
    home: g.homeTeam?.name || g.homeTeam,
    away: g.awayTeam?.name || g.awayTeam,
    kickoff: g.time,
    spread: g.odds?.spread ?? null,
    total: g.odds?.overUnder ?? null,
    homeLogoUrl: g.homeTeam?.logo,
    awayLogoUrl: g.awayTeam?.logo,
  }));

  return (
    <section className="p-6 space-y-4 text-center">
      <h1 className="text-3xl font-bold">Try the EdgePicks Demo</h1>
      <p className="text-gray-600">
        Explore upcoming games and watch our agents generate predictions.
      </p>
      <GameInsightsHero games={games} isLoading={isLoading} onSeeAgents={onStart} />
    </section>
  );
};

export default DemoHero;
