import { AgentResult, Matchup } from '../types';
import { pseudoMetric, logAgentReflection } from './utils';
import { AgentReflection } from '../../types/AgentReflection';
import { fetchOdds, type OddsGame } from '../data/odds';
import type { League } from '../data/schedule';

export const lineWatcher = async (matchup: Matchup): Promise<AgentResult> => {
  // Map line movement to confidence.
  // Input: point spread movement (movement).
  // Score: 0.5 base + movement/20, capped at 1.
  let odds = matchup.odds;
  if (!odds) {
    const oddsData = await fetchOdds(matchup.league as League);
    const game: OddsGame | undefined = oddsData.find(
      (o) =>
        (o.home_team === matchup.homeTeam && o.away_team === matchup.awayTeam) ||
        (o.home_team === matchup.awayTeam && o.away_team === matchup.homeTeam)
    );
    const bookmaker = game?.bookmakers?.[0];
    const spreads = bookmaker?.markets?.find((m) => m.key === 'spreads')?.outcomes;
    const totals = bookmaker?.markets?.find((m) => m.key === 'totals')?.outcomes;
    const h2h = bookmaker?.markets?.find((m) => m.key === 'h2h')?.outcomes;
    odds = game
      ? {
          spread: spreads?.find((o) => o.name === matchup.homeTeam)?.point ?? undefined,
          overUnder: totals?.[0]?.point ?? undefined,
          moneyline: {
            home: h2h?.find((o) => o.name === matchup.homeTeam)?.price ?? undefined,
            away: h2h?.find((o) => o.name === matchup.awayTeam)?.price ?? undefined,
          },
          bookmaker: bookmaker?.title,
          lastUpdate: bookmaker?.last_update,
        }
      : undefined;
  }

  if (odds?.spread !== undefined) {
    const favored = odds.spread < 0 ? matchup.homeTeam : matchup.awayTeam;
    const movement = Math.abs(odds.spread);
    const score = Math.min(1, 0.5 + movement / 20);
    const reason = `Spread ${odds.spread} from ${odds.bookmaker} (updated ${odds.lastUpdate})`;
    const reflection: AgentReflection = {
      whatIObserved: reason,
      whatIChose: `Favored ${favored}`,
      whatCouldImprove: 'Track live line movement',
    };
    await logAgentReflection('lineWatcher', reflection);
    return {
      team: favored,
      score,
      reason,
    };
  }

  const [homeLine, awayLine] = await Promise.all([
    pseudoMetric(`${matchup.homeTeam}-line`, 10),
    pseudoMetric(`${matchup.awayTeam}-line`, 10),
  ]);

  const diff = homeLine - awayLine;
  const favored = diff <= 0 ? matchup.awayTeam : matchup.homeTeam;
  const movement = Math.abs(diff);
  const score = Math.min(1, 0.5 + movement / 20);
  const reason = `Betting line favors ${favored} by ${movement.toFixed(1)} pts`;
  const reflection: AgentReflection = {
    whatIObserved: reason,
    whatIChose: `Favored ${favored}`,
    whatCouldImprove: 'Obtain bookmaker data',
  };
  await logAgentReflection('lineWatcher', reflection);

  return {
    team: favored,
    score,
    reason,
  };
};
