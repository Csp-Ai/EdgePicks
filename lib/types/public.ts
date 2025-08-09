// Public API contracts consumed by the UI
export type PublicPrediction = {
  gameId: string;
  league: string;      // "NFL", etc.
  home: string;
  away: string;
  kickoffISO: string;  // ISO string
  confidence?: number; // 0..1
  disagreement?: boolean;
};
