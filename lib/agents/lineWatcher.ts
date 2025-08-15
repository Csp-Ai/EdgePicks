import { AgentResult, Matchup } from '../types';
import { pseudoMetric, logAgentReflection } from './utils';
import { AgentReflection } from '../../types/AgentReflection';
import { fetchOdds, type OddsGame } from '../data/odds';
import type { League } from '../data/schedule';
import { toNormalizedOdds } from '../odds/normalize';

export const lineWatcher = async (matchup: Matchup): Promise<AgentResult> => {
  // Map line movement to confidence.
  // Input: point spread movement (movement).
  // Score: 0.5 base + movement/20, capped at 1.
  let odds = toNormalizedOdds(matchup.odds);
  let bookTitle: string | undefined;
  let lastUpdate: string | undefined;
  if (!odds.homeSpread && !odds.awaySpread && !odds.total) {
    const oddsData = await fetchOdds(matchup.league as League);
    const game: OddsGame | undefined = oddsData.find(
      (o) =>
        (o.home_team === matchup.homeTeam && o.away_team === matchup.awayTeam) ||
        (o.home_team === matchup.awayTeam && o.away_team === matchup.homeTeam)
    );
    const bookmaker = game?.bookmakers?.[0];
    const spreads = bookmaker?.markets?.find((m) => m.key === 'spreads')?.outcomes;
    const totals = bookmaker?.markets?.find((m) => m.key === 'totals')?.outcomes;
    odds = toNormalizedOdds({
      spread: {
        home: spreads?.find((o) => o.name === matchup.homeTeam)?.point,
        away: spreads?.find((o) => o.name === matchup.awayTeam)?.point,
      },
      total: totals?.[0]?.point,
    });
    bookTitle = bookmaker?.title;
    lastUpdate = bookmaker?.last_update;
  }

  if (odds.homeSpread !== undefined) {
    const spread = odds.homeSpread;
    const favored = spread < 0 ? matchup.homeTeam : matchup.awayTeam;
    const movement = Math.abs(spread);
    const score = Math.min(1, 0.5 + movement / 20);
    const reason = `Spread ${spread} from ${bookTitle ?? 'book'} (updated ${lastUpdate ?? 'n/a'})`;
    const reflection: AgentReflection = {
      whatIObserved: reason,
      whatIChose: `Favored ${favored}`,
      whatCouldImprove: 'Track live line movement',
    };
    await logAgentReflection('lineWatcher', reflection);
    const result: AgentResult = {
      name: 'lineWatcher',
      team: favored,
      score,
      reason,
    };
    return result;
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

  const result: AgentResult = {
    name: 'lineWatcher',
    team: favored,
    score,
    reason,
  };
  return result;
};
