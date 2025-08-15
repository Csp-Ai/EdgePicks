export interface DemoMatchup {
  id: string;
  home: string;
  away: string;
  kickoff: string; // ISO timestamp
  odds: {
    home: number | null;
    away: number | null;
  } | null;
}

export function getFallbackMatchups(): DemoMatchup[] {
  return [
    {
      id: 'demo-nfl-1',
      home: 'Dallas Cowboys',
      away: 'New York Giants',
      kickoff: '2025-09-07T20:20:00Z',
      odds: { home: null, away: null },
    },
    {
      id: 'demo-nfl-2',
      home: 'Green Bay Packers',
      away: 'Chicago Bears',
      kickoff: '2025-09-14T17:00:00Z',
      odds: { home: null, away: null },
    },
    {
      id: 'demo-nfl-3',
      home: 'San Francisco 49ers',
      away: 'Los Angeles Rams',
      kickoff: '2025-09-21T20:25:00Z',
      odds: { home: null, away: null },
    },
  ];
}

