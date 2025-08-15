import { z } from 'zod';
import type { Matchup } from '../types';

// Raw game shape from the MLB schedule API. Mirrors the NFL API response.
const MlbGameSchema = z.object({
  id: z.string(),
  home: z.string(),
  away: z.string(),
  commence_time: z.string(),
});

export type MlbGame = z.infer<typeof MlbGameSchema>;

const MlbScheduleSchema = z.array(MlbGameSchema);

/**
 * Normalize MLB API schedule data into internal Matchup objects.
 */
export function normalizeMlbSchedule(data: unknown): Matchup[] {
  const games = MlbScheduleSchema.parse(data);
  return games.map((g) => ({
    id: `mlb-${g.id}`,
    homeTeam: g.home,
    awayTeam: g.away,
    time: g.commence_time,
    league: 'MLB',
    gameId: g.id,
    source: 'live-mlb-api',
  }));
}
