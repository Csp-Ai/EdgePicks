import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import AppHeader from '../components/AppHeader';
import HeroStrip from '../components/HeroStrip';
import UpcomingGamesGrid from '../components/UpcomingGamesGrid';
import type { Game } from '../lib/types';

const PredictionDrawer = dynamic(() => import('../components/PredictionDrawer'), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const LEAGUES = ['NFL', 'NBA', 'MLB', 'NHL'];

export default function Home() {
  const router = useRouter();
  const queryLeague = typeof router.query.league === 'string' ? router.query.league : null;
  const [league, setLeague] = useState(queryLeague || 'NFL');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('league') : null;
    if (!queryLeague && stored) {
      setLeague(stored);
      router.replace({ query: { ...router.query, league: stored } }, undefined, { shallow: true });
    } else if (queryLeague) {
      setLeague(queryLeague);
      if (typeof window !== 'undefined') localStorage.setItem('league', queryLeague);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryLeague]);

  const { data, error, isLoading, mutate } = useSWR<any[]>(
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

  const preloadDrawer = () => (PredictionDrawer as any).preload?.();

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


  const headTitle = selected
    ? `Win more pick'em: ${selected.homeTeam} vs ${selected.awayTeam} live AI prediction`
    : 'Win more pick\'em picks';
  const headDesc = selected
    ? `Live prediction for ${selected.homeTeam} vs ${selected.awayTeam}.`
    : 'AI-powered predictions for upcoming games.';

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDesc} />
      </Head>
      <AppHeader />
      <HeroStrip />
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-4 space-y-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {LEAGUES.map((l) => (
              <button
                key={l}
                onClick={() => changeLeague(l)}
                className={`px-3 py-1 rounded border ${
                  l === league ? 'bg-blue-600 text-white' : ''
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
            className="border px-2 py-1 rounded w-full sm:w-auto"
          />
        </div>
        {pendingId && !games.find((g) => g.gameId === pendingId) && !isLoading ? (
          <div className="text-center">
            <p>Game not found.</p>
            <button
              className="mt-2 px-3 py-1 border rounded"
              onClick={() => {
                setPendingId(null);
                const { gameId, ...rest } = router.query;
                router.push({ query: rest }, undefined, { shallow: true });
              }}
            >
              Back
            </button>
          </div>
        ) : (
          <section
            id="live-games"
            aria-label="Live games"
            tabIndex={-1}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            <UpcomingGamesGrid
              games={games}
              search={search}
              onSelect={handleSelect}
              isLoading={isLoading}
              isError={!!error}
              onRetry={() => mutate()}
              preload={preloadDrawer}
            />
          </section>
        )}
        <PredictionDrawer game={selected} isOpen={!!selected} onClose={handleClose} />
      </main>
    </>
  );
}
