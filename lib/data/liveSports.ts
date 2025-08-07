import { Matchup } from '../types';
import { ENV } from '../env';

// Supported league identifiers.  We expose these so callers can reference the
// specific league types when needed but the public API of this module is via
// the dedicated fetch helpers defined at the bottom of the file.
export type League = 'NFL' | 'MLB' | 'NBA' | 'NHL';

const SPORTS_API_KEY = ENV.SPORTS_API_KEY;
const SPORTSDB_TEAM_URL = `https://www.thesportsdb.com/api/v1/json/${SPORTS_API_KEY}/lookupteam.php?id=`;

const SPORTS_DB_LEAGUE_IDS: Record<League, string | undefined> = {
  NFL: ENV.SPORTS_DB_NFL_ID,
  MLB: ENV.SPORTS_DB_MLB_ID,
  NBA: ENV.SPORTS_DB_NBA_ID,
  NHL: ENV.SPORTS_DB_NHL_ID,
};

const ODDS_API_SPORT_MAP: Record<League, string> = {
  NFL: 'americanfootball_nfl',
  MLB: 'baseball_mlb',
  NBA: 'basketball_nba',
  NHL: 'icehockey_nhl',
};

// ---------------------------------------------------------------------------
// In-memory caches
// ---------------------------------------------------------------------------

interface LogoCacheEntry {
  logo?: string;
  timestamp: number;
}

interface OddsCacheEntry {
  data: OddsGame[];
  timestamp: number;
}

// Module-level caches scoped by league/team so they can be shared across
// requests while the server remains warm.
const logoCache = new Map<string, LogoCacheEntry>();
const oddsCache = new Map<League, OddsCacheEntry>();

// Logos rarely change so cache longer than odds.
const LOGO_TTL = 24 * 60 * 60 * 1000; // 24 hours
const ODDS_TTL = 60 * 1000; // 1 minute

interface SportsDbEvent {
  idEvent: string;
  strHomeTeam: string | null;
  strAwayTeam: string | null;
  dateEvent: string | null;
  strTime: string | null;
  idHomeTeam: string | null;
  idAwayTeam: string | null;
}

interface OddsGame {
  home_team: string;
  away_team: string;
  bookmakers: {
    title: string;
    last_update: string;
    markets: { key: string; outcomes: { name: string; price?: number; point?: number }[] }[];
  }[];
}

function logoCacheKey(league: League, id: string) {
  return `${league}-${id}`;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  backoff = 500,
  isDev = false
): Promise<Response> {
  let res: Response = await fetch(url, options);
  for (let attempt = 0; attempt < retries && res.status === 429; attempt++) {
    if (isDev) {
      console.warn(`Rate limited for ${url}. Retrying in ${backoff * (attempt + 1)}ms`);
    }
    await new Promise((r) => setTimeout(r, backoff * (attempt + 1)));
    res = await fetch(url, options);
  }
  return res;
}

async function fetchTeamLogo(
  league: League,
  id: string,
  isDev: boolean
): Promise<string | undefined> {
  const key = logoCacheKey(league, id);
  const cached = logoCache.get(key);
  if (cached && Date.now() - cached.timestamp < LOGO_TTL) {
    return cached.logo;
  }
  try {
    const r = await fetchWithRetry(`${SPORTSDB_TEAM_URL}${id}`, {}, 2, 500, isDev);
    const d = await r.json();
    const team = d.teams && d.teams[0];
    const logo = team?.strTeamBadge;
    logoCache.set(key, { logo, timestamp: Date.now() });
    return logo;
  } catch (err) {
    if (isDev) console.error('team lookup failed', err);
    return undefined;
  }
}

async function fetchLeagueOdds(
  league: League,
  url: string,
  isDev: boolean
): Promise<OddsGame[]> {
  const cached = oddsCache.get(league);
  if (cached && Date.now() - cached.timestamp < ODDS_TTL) {
    return cached.data;
  }
  let oddsData: OddsGame[] = [];
  try {
    const oddsKey = ENV.ODDS_API_KEY;
    if (oddsKey) {
      const oddsRes = await fetchWithRetry(
        `${url}?regions=us&markets=h2h,spreads,totals&apiKey=${oddsKey}`,
        {},
        2,
        500,
        isDev
      );
      if (oddsRes.status === 429) {
        throw new Error('ODDS_API_RATE_LIMIT');
      }
      if (oddsRes.ok) {
        oddsData = await oddsRes.json();
      }
      if (isDev) {
        console.log('OddsAPI response', {
          status: oddsRes.status,
          error: oddsRes.ok ? undefined : oddsRes.statusText,
          dataLength: oddsData.length,
          data: oddsData,
        });
      }
    }
  } catch (err) {
    if (isDev) console.error('odds fetch failed', err);
  }
  oddsCache.set(league, { data: oddsData, timestamp: Date.now() });
  return oddsData;
}

// Generic fetcher used internally.  Given a league identifier it will fetch
// upcoming games from TheSportsDB and odds information from The Odds API.
// Specific league helpers simply wrap this function with the appropriate
// league argument.
async function fetchUpcomingGames(league: League): Promise<Matchup[]> {
  const isDev = process.env.NODE_ENV === 'development';
  const leagueId = SPORTS_DB_LEAGUE_IDS[league];
  if (!leagueId) return [];
  const eventsUrl = `https://www.thesportsdb.com/api/v1/json/${SPORTS_API_KEY}/eventsnextleague.php?id=${leagueId}`;
  const oddsSport = ODDS_API_SPORT_MAP[league];
  const oddsApiUrl = `https://api.the-odds-api.com/v4/sports/${oddsSport}/odds/`;
  try {
    const res = await fetchWithRetry(eventsUrl, {}, 2, 500, isDev);
    if (res.status === 429) {
      throw new Error('SPORTS_DB_RATE_LIMIT');
    }
    const json = await res.json();
    if (isDev) {
      console.log('TheSportsDB response', {
        status: res.status,
        error: res.ok ? undefined : res.statusText,
        dataLength: json.events ? json.events.length : 0,
        data: json,
      });
    }
    const events: SportsDbEvent[] = json.events ? json.events.slice(0, 5) : [];

    const teamIds = Array.from(
      new Set(
        events.flatMap((e) => [e.idHomeTeam, e.idAwayTeam].filter((id): id is string => Boolean(id)))
      )
    );

    const logoMap: Record<string, string> = {};
    await Promise.all(
      teamIds.map(async (id) => {
        const logo = await fetchTeamLogo(league, id, isDev);
        if (logo) logoMap[id] = logo;
      })
    );

    const oddsData = await fetchLeagueOdds(league, oddsApiUrl, isDev);

    return events.map((e) => {
      const home = e.strHomeTeam ?? '';
      const away = e.strAwayTeam ?? '';
      const gameOdds = oddsData.find(
        (g) =>
          (g.home_team === home && g.away_team === away) ||
          (g.home_team === away && g.away_team === home)
      );
      const bookmaker = gameOdds?.bookmakers?.[0];
      const spreads = bookmaker?.markets?.find((m) => m.key === 'spreads')?.outcomes;
      const totals = bookmaker?.markets?.find((m) => m.key === 'totals')?.outcomes;
      const h2h = bookmaker?.markets?.find((m) => m.key === 'h2h')?.outcomes;
      const odds = gameOdds
        ? {
            spread: spreads?.find((o) => o.name === home)?.point ?? undefined,
            overUnder: totals?.[0]?.point ?? undefined,
            moneyline: {
              home: h2h?.find((o) => o.name === home)?.price ?? undefined,
              away: h2h?.find((o) => o.name === away)?.price ?? undefined,
            },
            bookmaker: bookmaker?.title,
            lastUpdate: bookmaker?.last_update,
          }
        : undefined;

      return {
        homeTeam: home,
        awayTeam: away,
        time: e.dateEvent && e.strTime ? `${e.dateEvent} ${e.strTime}` : e.dateEvent || '',
        league,
        gameId: e.idEvent ?? undefined,
        homeLogo: e.idHomeTeam ? logoMap[e.idHomeTeam] : undefined,
        awayLogo: e.idAwayTeam ? logoMap[e.idAwayTeam] : undefined,
        odds,
        source: `live-${league.toLowerCase()}-api`,
      } as Matchup;
    });
  } catch (err) {
    if (isDev) console.error('fetchUpcomingGames error', err);
    throw err;
  }
}

// Convenience helpers for each supported league.  These provide a clearer API
// for consumers that want to fetch games for a specific sport without having to
// remember league string literals.
export const fetchNflGames = () => fetchUpcomingGames('NFL');
export const fetchMlbGames = () => fetchUpcomingGames('MLB');
export const fetchNbaGames = () => fetchUpcomingGames('NBA');
export const fetchNhlGames = () => fetchUpcomingGames('NHL');

