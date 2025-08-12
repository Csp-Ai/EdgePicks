'use client';
import useSWR from 'swr';
import { apiGet } from '@/lib/api';
import { normalizeUpcomingGames } from '@/lib/normalize';
import type { UpcomingGame } from '@/lib/types';

export function useUpcomingGames() {
  return useSWR<UpcomingGame[]>('/api/upcoming-games', async (key) => {
    const raw = await apiGet<any>(key);
    return normalizeUpcomingGames(raw);
  }, {
    revalidateOnFocus: true,
    errorRetryCount: 2,
  });
}
