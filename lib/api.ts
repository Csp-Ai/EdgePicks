export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

// Convenience typed endpoints
import type { UpcomingGame, AgentEvent, Prediction } from './types';

export const getUpcomingGames = () => apiGet<UpcomingGame[]>('/api/upcoming-games');
export const getAgentEvents = () => apiGet<AgentEvent[]>('/api/agent-events');
export const getPrediction = (gameId: string) =>
  apiGet<Prediction>(`/api/run-predictions?gameId=${encodeURIComponent(gameId)}`);
