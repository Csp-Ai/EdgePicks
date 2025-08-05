export interface Matchup {
  homeTeam: string;
  awayTeam: string;
  pick: string;
  confidence: number; // value between 0 and 1
  reasons: string[];
}

export const mockMatchups: Matchup[] = [
  {
    homeTeam: 'Patriots',
    awayTeam: 'Jets',
    pick: 'Patriots',
    confidence: 0.72,
    reasons: [
      'Jets missing starting QB',
      'Patriots defense ranks top 5 vs run',
      'Line moved 2 points toward NE',
    ],
  },
  {
    homeTeam: 'Cowboys',
    awayTeam: 'Eagles',
    pick: 'Eagles',
    confidence: 0.61,
    reasons: [
      'Eagles healthier on offensive line',
      'Public heavy on Cowboys, line stagnant',
      'Stat models favor PHI by 1.5',
    ],
  },
  {
    homeTeam: 'Packers',
    awayTeam: 'Bears',
    pick: 'Packers',
    confidence: 0.67,
    reasons: [
      'Bears star RB questionable with ankle',
      'Green Bay -3 to -4.5 line movement',
      'QB efficiency edge to Packers',
    ],
  },
];
