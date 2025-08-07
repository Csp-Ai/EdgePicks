import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import UpcomingGamesGrid from '../components/UpcomingGamesGrid';
import PredictionDrawer from '../components/PredictionDrawer';
import type { Game } from '../lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const LEAGUES = ['NFL', 'NBA', 'MLB', 'NHL'];

export default function Home() {
  const router = useRouter();
  const league =
    typeof router.query.league === 'string' ? router.query.league : 'NFL';
  const { data } = useSWR<any[]>(
    `/api/upcoming-games?league=${league}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
  const games: Game[] = (data || []).map((g: any) => ({
    gameId: g.gameId,
    league: g.league,
    homeTeam: g.homeTeam?.name || g.homeTeam,
    awayTeam: g.awayTeam?.name || g.awayTeam,
    time: g.time,
    homeLogo: g.homeTeam?.logo,
    awayLogo: g.awayTeam?.logo,
    odds: g.odds,
    source: g.source,
  }));
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Game | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  // handle deep link
  useEffect(() => {
    const gameId = typeof router.query.gameId === 'string' ? router.query.gameId : null;
    if (gameId && games.length) {
      const found = games.find((g) => g.gameId === gameId);
      if (found) {
        setSelected(found);
      } else {
        setPendingId(gameId);
      }
    }
  }, [router.query.gameId, games]);

  useEffect(() => {
    if (pendingId && games.length) {
      const found = games.find((g) => g.gameId === pendingId);
      if (found) {
        setSelected(found);
        setPendingId(null);
      }
    }
  }, [pendingId, games]);

  const handleSelect = (game: Game) => {
    setSelected(game);
    router.push(
      { query: { ...router.query, league, gameId: game.gameId } },
      undefined,
      { shallow: true }
    );
  };

  const handleClose = () => {
    setSelected(null);
    const { gameId, ...rest } = router.query;
    router.push({ query: rest }, undefined, { shallow: true });
  };

  const changeLeague = (l: string) => {
    router.push({ query: { ...router.query, league: l } }, undefined, {
      shallow: true,
    });
  };


  return (
    <main className="min-h-screen p-4 space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex gap-2">
          {LEAGUES.map((l) => (
            <button
              key={l}
              onClick={() => changeLeague(l)}
              className={`px-3 py-1 rounded border ${
                l === league ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="border px-2 py-1 rounded"
        />
      </header>
      <UpcomingGamesGrid games={games} search={search} onSelect={handleSelect} />
      <PredictionDrawer game={selected} isOpen={!!selected} onClose={handleClose} />
    </main>
  );
}
