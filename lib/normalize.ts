import type { UpcomingGame } from "@/lib/types";

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

export function normalizeUpcomingGames(raw: any): UpcomingGame[] {
  const list: any[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
  return list.map((g, i): UpcomingGame => {
    // Accept a variety of shapes
    const id =
      g.id ??
      g.gameId ??
      g.idEvent ??
      g.idGame ??
      g.event_id ??
      String(g._id ?? i);

    const home =
      g.homeTeam ??
      g.home_team ??
      g.strHomeTeam ??
      g.home ??
      g.teamHome ??
      "";

    const away =
      g.awayTeam ??
      g.away_team ??
      g.strAwayTeam ??
      g.away ??
      g.teamAway ??
      "";

    // kickoff candidates: ISO, epoch seconds, TheSportsDB date+time
    const kickoffIso =
      g.kickoff ??
      g.commence_time ??
      g.startTime ??
      g.start_time ??
      toIso(g.dateEvent || g.event_date || g.date, g.strTime || g.event_time || g.time, g.epoch || g.timestamp) ??
      null;

    // odds candidates
    const odds =
      g.odds ??
      (g.prices
        ? { home: g.prices.home, away: g.prices.away, draw: g.prices.draw ?? undefined }
        : g.moneyline
        ? { home: g.moneyline.home, away: g.moneyline.away, draw: g.moneyline.draw ?? undefined }
        : null);

    const logos =
      g.logos ??
      (g.homeLogo || g.awayLogo ? { home: g.homeLogo, away: g.awayLogo } : undefined);

    return {
      id: String(id),
      league: g.league || g.sport || "NFL",
      homeTeam: String(home),
      awayTeam: String(away),
      kickoff: kickoffIso || "",
      odds: odds ?? null,
      logos: logos ?? {},
    };
  });
}

export function safeLocalDate(iso: string | null | undefined): string {
  if (!iso) return "TBD";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleString();
}

