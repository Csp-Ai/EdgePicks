export interface Game {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  kickoff?: string;
  odds?: {
    homeSpread?: number;
    awaySpread?: number;
    total?: number;
  };
  status?: 'upcoming' | 'live' | 'final';
}

export interface UpcomingGame extends Game {
  status: 'upcoming';
}

export interface LiveGame extends Game {
  status: 'live';
  score?: {
    home: number;
    away: number;
  };
  quarter?: number;
  timeRemaining?: string;
}

export interface CompletedGame extends Game {
  status: 'final';
  score: {
    home: number;
    away: number;
  };
}
