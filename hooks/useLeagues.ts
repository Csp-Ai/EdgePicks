'use client';

import { useState, useEffect } from 'react';
import { useUpcomingGames } from './useUpcomingGames';

interface League {
  id: string;
  name: string;
  icon: string;
  gameCount?: number;
}

const SUPPORTED_LEAGUES: League[] = [
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
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('league', activeLeague);
      window.history.pushState({}, '', url);
    }
  }, [activeLeague]);

  // Get active league details
  const activeSummary = leagues.find(league => league.id === activeLeague) || leagues[0];

  return {
    leagues,
    activeLeague: activeSummary.id,
    activeLeagueName: activeSummary.name,
    activeLeagueIcon: activeSummary.icon,
    setActiveLeague,
  };
}
