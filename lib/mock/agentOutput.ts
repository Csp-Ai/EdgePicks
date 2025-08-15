import { MatchupWithPick, Reason } from '../types';

const mkReason = (text: string): Reason => ({
  agent: 'mock',
  explanation: text,
  weight: 1,
});

export const mockMatchups: MatchupWithPick[] = [
  {
    id: 'mock-1',
    gameId: 'mock-1',
    homeTeam: 'Patriots',
    awayTeam: 'Jets',
    time: '',
    league: '',
    winner: 'Patriots',
    confidence: 0.72,
    reasons: [
      'Jets missing starting QB',
      'Patriots defense ranks top 5 vs run',
      'Line moved 2 points toward NE',
    ].map(mkReason),
  },
  {
    id: 'mock-2',
    gameId: 'mock-2',
    homeTeam: 'Cowboys',
    awayTeam: 'Eagles',
    time: '',
    league: '',
    winner: 'Eagles',
    confidence: 0.61,
    reasons: [
      'Eagles healthier on offensive line',
      'Public heavy on Cowboys, line stagnant',
      'Stat models favor PHI by 1.5',
    ].map(mkReason),
  },
  {
    id: 'mock-3',
    gameId: 'mock-3',
    homeTeam: 'Packers',
    awayTeam: 'Bears',
    time: '',
    league: '',
    winner: 'Packers',
    confidence: 0.67,
    reasons: [
      'Bears star RB questionable with ankle',
      'Green Bay -3 to -4.5 line movement',
      'QB efficiency edge to Packers',
    ].map(mkReason),
  },
];
