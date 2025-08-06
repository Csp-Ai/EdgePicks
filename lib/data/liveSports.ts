import { Matchup } from '../types';

const SPORTSDB_EVENTS_URL = 'https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4391';
const SPORTSDB_TEAM_URL = 'https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=';
const ODDS_API_URL = 'https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/';

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

export async function fetchUpcomingGames(): Promise<Matchup[]> {
  try {
    const res = await fetch(SPORTSDB_EVENTS_URL);
    const json = await res.json();
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
          console.error('team lookup failed', err);
        }
      })
    );

    let oddsData: OddsGame[] = [];
    try {
      const oddsKey = process.env.ODDS_API_KEY;
      if (oddsKey) {
        const oddsRes = await fetch(
          `${ODDS_API_URL}?regions=us&markets=h2h,spreads,totals&apiKey=${oddsKey}`
        );
        if (oddsRes.ok) {
          oddsData = await oddsRes.json();
        }
      }
    } catch (err) {
      console.error('odds fetch failed', err);
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
        league: 'NFL',
        gameId: e.idEvent ?? undefined,
        homeLogo: e.idHomeTeam ? logoMap[e.idHomeTeam] : undefined,
        awayLogo: e.idAwayTeam ? logoMap[e.idAwayTeam] : undefined,
        odds,
        source: 'live-nfl-api',
      } as Matchup;
    });
  } catch (err) {
    console.error('fetchUpcomingGames error', err);
    return [];
  }
}

