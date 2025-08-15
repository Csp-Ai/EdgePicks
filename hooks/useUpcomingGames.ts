'use client';
import useSWR from 'swr';
import { apiGet } from '@/lib/api';
import { normalizeUpcomingGames } from '@/lib/normalize';
import type { Matchup } from '@/lib/types';

export function useUpcomingGames(league?: string) {
  const { data, error, isLoading } = useSWR<Matchup[]>(
    '/api/upcoming-games',
    async () => {
      const raw = await apiGet<any>('/api/upcoming-games');
      const games = normalizeUpcomingGames(raw);
      return league ? games.filter(game => game.league === league) : games;
    },
    {
      revalidateOnFocus: true,
      errorRetryCount: 2,
    }
  );

  return {
    data,
    error,
    isLoading
  };
}
