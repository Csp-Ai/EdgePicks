import { Matchup } from '../types';
import { ENV, getEnv } from '../env';

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

// Generic fetcher used internally.  Given a league identifier it will fetch
// upcoming games from TheSportsDB and odds information from The Odds API.
// Specific league helpers simply wrap this function with the appropriate
// league argument.
async function fetchUpcomingGames(league: League): Promise<Matchup[]> {
  const isDev = getEnv('NODE_ENV', { required: false }) === 'development';
  const leagueId = SPORTS_DB_LEAGUE_IDS[league];
  if (!leagueId) return [];
  const eventsUrl = `https://www.thesportsdb.com/api/v1/json/${SPORTS_API_KEY}/eventsnextleague.php?id=${leagueId}`;
  const oddsSport = ODDS_API_SPORT_MAP[league];
  const oddsApiUrl = `https://api.the-odds-api.com/v4/sports/${oddsSport}/odds/`;
  try {
    const res = await fetch(eventsUrl);
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
        try {
          const r = await fetch(`${SPORTSDB_TEAM_URL}${id}`);
          const d = await r.json();
          const team = d.teams && d.teams[0];
          if (team?.strTeamBadge) logoMap[id] = team.strTeamBadge;
        } catch (err) {
          if (isDev) console.error('team lookup failed', err);
        }
      })
    );

    let oddsData: OddsGame[] = [];
    try {
      const oddsKey = ENV.ODDS_API_KEY;
      if (oddsKey) {
        const oddsRes = await fetch(
          `${oddsApiUrl}?regions=us&markets=h2h,spreads,totals&apiKey=${oddsKey}`
        );
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
    return [];
  }
}

// Convenience helpers for each supported league.  These provide a clearer API
// for consumers that want to fetch games for a specific sport without having to
// remember league string literals.
export const fetchNflGames = () => fetchUpcomingGames('NFL');
export const fetchMlbGames = () => fetchUpcomingGames('MLB');
export const fetchNbaGames = () => fetchUpcomingGames('NBA');
export const fetchNhlGames = () => fetchUpcomingGames('NHL');

