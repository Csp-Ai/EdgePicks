import { useState, useEffect } from 'react';
import { useUpcomingGames } from './useUpcomingGames';

const SUPPORTED_LEAGUES = [
  { id: 'NFL', name: 'NFL', icon: '🏈' },
  { id: 'NBA', name: 'NBA', icon: '🏀' },
  { id: 'MLB', name: 'MLB', icon: '⚾' },
  { id: 'NHL', name: 'NHL', icon: '🏒' },
  { id: 'MLS', name: 'MLS', icon: '⚽' },
];

export function useLeagues(defaultLeague = 'NFL') {
  const [activeLeague, setActiveLeague] = useState(defaultLeague);
  const { data: allGames } = useUpcomingGames();

  // Count games per league
  const leagues = SUPPORTED_LEAGUES.map(league => {
    const gameCount = allGames?.filter(game => game.league === league.id).length ?? 0;
    return { ...league, gameCount };
  });

  // Update URL when league changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('league', activeLeague);
    window.history.pushState({}, '', url);
  }, [activeLeague]);

  return {
    leagues,
    activeLeague,
    setActiveLeague,
  };
}
