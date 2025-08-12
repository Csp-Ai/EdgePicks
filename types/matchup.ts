import type { Game } from './game';
import type { PickWithReasoning } from './picks';

export interface Matchup extends Game {
  id: string; // Added required property
  gameId: string; // Added required property
  matchDay?: string; // Optional property for match day
  odds?: {
    homeSpread?: number;
    awaySpread?: number;
    total?: number;
  }; // Added optional odds property
  source?: string; // Added optional source property
  useFallback?: boolean; // Added optional useFallback property
}               // same shape for now
export interface MatchupWithPick extends Matchup, PickWithReasoning {}
export type Prediction = PickWithReasoning;
export interface UpcomingGame extends Game {
  gameId: string;
}
