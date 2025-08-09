import type { DataAdapter, RunArchive } from "../UniversalAgentInterface";
import type { PublicPrediction } from "@/lib/types/public";

export const SportsAdapter: DataAdapter = {
  name: "sports-live",
  async list(): Promise<PublicPrediction[]> {
    const r = await fetch("/api/upcoming-games?league=NFL", { cache: "no-store" });
    if (!r.ok) throw new Error("Failed to load upcoming games");
    return await r.json();
  },
  async run(gameId: string) {
    const r = await fetch(`/api/run-agents?gameId=${encodeURIComponent(gameId)}`, { method: "POST" });
    if (!r.ok) throw new Error("Failed to start run");
    return await r.json(); // { runId }
  },
  async archive(runId: string): Promise<RunArchive> {
    const r = await fetch(`/api/runs/${encodeURIComponent(runId)}`);
    if (!r.ok) throw new Error("Archive not found");
    return await r.json();
  },
};
