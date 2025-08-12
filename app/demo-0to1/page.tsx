import nextDynamic from "next/dynamic";
import { Metadata } from "next";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/fetcher";
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const AgentFlowVisualizer = nextDynamic(
  () => import("@/components/visuals/AgentFlowVisualizer"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "0→1 Live Demo",
};

export default function Page() {
  const { data: games, isLoading: loadingGames } = useSWR("/api/upcoming-games", jsonFetcher);
  const { data: preds, isLoading: loadingPreds } = useSWR("/api/run-predictions", jsonFetcher);

  return (
    <div className="container py-8 space-y-8">
      <section id="hero" className="space-y-2">
        <h1 className="text-2xl font-semibold">Zero‑to‑One Live Demo</h1>
        <p className="text-muted-foreground">This view streams agent activity when available, or simulates it automatically.</p>
        <a href="#live" className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-accent">Jump to Live ↴</a>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Today’s Matchups</h2>
        {loadingGames ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-md border animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {games?.slice?.(0, 6)?.map((g: any) => (
              <div key={g.id ?? `${g.home}-${g.away}`} className="rounded-md border p-3 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">{g.home} vs {g.away}</div>
                  <div className="text-muted-foreground">{g.startTime ?? "TBD"}</div>
                </div>
                <div className="text-xs text-muted-foreground">league: {g.league ?? "n/a"}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Top Pick Snapshot</h2>
        {loadingPreds ? (
          <div className="h-20 rounded-md border animate-pulse bg-muted" />
        ) : (
          <div className="rounded-md border p-3">
            {preds?.topPick ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">Top pick</div>
                  <div className="text-base font-semibold">{preds.topPick.matchup ?? "—"}</div>
                </div>
                <div className="text-sm">Confidence: <span className="font-semibold">{Math.round((preds.topPick.confidence ?? 0.6) * 100)}%</span></div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No live pick available.</div>
            )}
          </div>
        )}
      </section>

      <section id="live">
        <h2 className="text-lg font-medium mb-2">Agent Flow</h2>
        <AgentFlowVisualizer />
      </section>
    </div>
  );
}
