import { Database } from '@/types/supabase';

type LiveGame = Database['public']['Tables']['live_games']['Row'];
type AgentRun = Database['public']['Tables']['agent_runs']['Row'];
type AgentReflection = Database['public']['Tables']['agent_reflections']['Row'];

export interface TransformedGame {
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  confidence: number;
  edgePick: any[];
  winner: string;
  edgeDelta: number;
  odds?: {
    spread?: number;
    overUnder?: number;
    moneyline?: { home?: number; away?: number };
    bookmaker?: string;
    lastUpdate?: string;
  };
}

export function transformGame(game: LiveGame): TransformedGame {
  return {
    homeTeam: game.homeTeam,
    awayTeam: game.awayTeam,
    league: game.league,
    time: game.time,
    confidence: game.confidence,
    edgePick: game.edgePick,
    winner: game.winner,
    edgeDelta: game.edgeDelta,
    odds: game.odds as TransformedGame['odds']
  };
}

export function transformRunOutput(run: AgentRun) {
  if (!run.output) return null;

  return {
    id: run.id,
    status: run.status,
    result: run.output,
    error: run.error,
    timestamp: run.updated_at
  };
}

export function formatReflection(reflection: AgentReflection) {
  return {
    agent: reflection.agent,
    message: reflection.message,
    metadata: reflection.metadata,
    environment: reflection.environment,
    timestamp: reflection.timestamp
  };
}

export function calculateConfidence(predictions: any[]): number {
  if (!predictions || predictions.length === 0) return 0;

  // Weight each prediction by the agent's confidence
  const weightedPredictions = predictions.map(p => ({
    prediction: p.prediction,
    weight: p.confidence || 1
  }));

  // Calculate total weight
  const totalWeight = weightedPredictions.reduce((sum, p) => sum + p.weight, 0);

  // Get the most predicted outcome
  const outcomes = weightedPredictions.reduce((acc, p) => {
    acc[p.prediction] = (acc[p.prediction] || 0) + p.weight;
    return acc;
  }, {} as Record<string, number>);

  const [topOutcome, topWeight] = Object.entries(outcomes).reduce(
    (max, [outcome, weight]) => (weight > max[1] ? [outcome, weight] : max),
    ['', 0]
  );

  // Return confidence as ratio of top prediction weight to total weight
  return topWeight / totalWeight;
}
