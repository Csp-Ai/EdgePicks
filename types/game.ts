export interface Game {
  /** unique id for UI (used by grid/cards) */
  id: string;
  /** backend/game API id (if different) */
  gameId: string;
  league: 'nfl' | 'mlb' | 'nba' | 'nhl' | 'all' | string;
  homeTeam: string;
  awayTeam: string;
  /** ISO string */
  time: string;

  /** optional UI fields */
  homeLogo?: string;
  awayLogo?: string;

  /** additional properties */
  kickoff?: string; // Added optional kickoff property
  odds?: {
    homeSpread?: number;
    awaySpread?: number;
    total?: number;
  }; // Added optional odds property
}
