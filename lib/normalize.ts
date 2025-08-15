import type { Matchup } from "@/lib/types";

function toIso(dateStr?: string | null, timeStr?: string | null, epochSec?: number | null): string | null {
  // Prefer epoch seconds if present
  if (typeof epochSec === "number" && !Number.isNaN(epochSec)) {
    try {
      return new Date(epochSec * 1000).toISOString();
    } catch {
      /* ignore */
    }
  }
  // Try combined date+time (assume UTC if 'Z' or include offset; otherwise treat as local and coerce)
  if (dateStr && timeStr) {
    const joined = `${dateStr} ${timeStr}`.trim();
    const d = new Date(joined);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  // Try date only
  if (dateStr) {
    const d = new Date(dateStr);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return null;
}

export function normalizeUpcomingGames(raw: any): Matchup[] {
  const list: any[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
  
  return list
    .map((game): Matchup | null => {
      try {
        const kickoff = toIso(
          game.dateEvent || game.event_date || game.date,
          game.strTime || game.event_time || game.time,
          game.epoch || game.timestamp || game.epochSec
        );
        
        return {
          id: game.id || game.gameId || game.idEvent || game.idGame || game.event_id || `game-${Date.now()}`,
          league: game.league || game.competition || game.sport || 'Unknown',
          homeTeam: game.homeTeam || game.home_team || game.strHomeTeam || game.home || game.teamHome || '',
          awayTeam: game.awayTeam || game.away_team || game.strAwayTeam || game.away || game.teamAway || '',
          kickoff: kickoff || undefined,
          gameId: game.id || game.gameId || game.idEvent || game.idGame || game.event_id || `game-${Date.now()}`,
          time: kickoff || '',
          odds: {
            homeSpread: typeof game.homeSpread === 'number' ? game.homeSpread : undefined,
            awaySpread: typeof game.awaySpread === 'number' ? game.awaySpread : undefined,
            total: typeof game.total === 'number' ? game.total : undefined,
          },
        };
      } catch (e) {
        console.error('Failed to normalize game:', e);
        return null;
      }
    })
    .filter((game): game is Matchup => game !== null);
}

export function safeLocalDate(iso: string | null | undefined): string {
  if (!iso) return "TBD";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleString();
}

