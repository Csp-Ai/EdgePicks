function cleanHeaders(input?: HeadersInit): HeadersInit | undefined {
  if (!input) return undefined;
  if (Array.isArray(input)) return input.filter(([, v]) => v !== undefined) as [string, string][];
  if (input instanceof Headers) return input;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = cleanHeaders(init?.headers);
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

// Convenience typed endpoints
import type { UpcomingGame, AgentEvent, Prediction } from '@/lib/types';

export const getUpcomingGames = () => apiGet<UpcomingGame[]>('/api/upcoming-games');
export const getAgentEvents = () => apiGet<AgentEvent[]>('/api/agent-events');
export const getPrediction = (gameId: string) =>
  apiGet<Prediction>(`/api/run-predictions?gameId=${encodeURIComponent(gameId)}`);

// Normalized convenience (kept separate to avoid circular deps in hooks)
export async function getNormalizedUpcomingGames(): Promise<import('@/lib/types').UpcomingGame[]> {
  const raw = await apiGet<any>("/api/upcoming-games");
  const { normalizeUpcomingGames } = await import("./normalize");
  return normalizeUpcomingGames(raw);
}
