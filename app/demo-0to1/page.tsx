'use client';

import { useState } from 'react';
import nextDynamic from "next/dynamic";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/fetcher";
import type { Game } from '@/lib/types';
import { Card } from '@/components/ui/card';
import Skeleton from '@/components/ui/skeleton';
import Link from 'next/link';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const AgentFlowVisualizer = nextDynamic(
  () => import("@/components/visuals/AgentFlowVisualizer"),
  { ssr: false }
);

// Moved metadata to layout.tsx since this is a client component

interface Prediction {
  winner: string;
  confidence: number;
}

interface Predictions {
  [key: string]: Prediction;
}

function GameCard({ game, selected, onSelect, prediction }: {
  game: Game;
  selected: boolean;
  onSelect: () => void;
  prediction?: Prediction;
}) {
  return (
    <Card
      className={`p-4 cursor-pointer ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{game.homeTeam} vs {game.awayTeam}</p>
          <p className="text-sm text-muted-foreground">{game.kickoffDisplay || game.time}</p>
        </div>
        {prediction && (
          <div className="text-right">
            <p className="font-medium">{prediction.winner}</p>
            <p className="text-sm text-muted-foreground">
              {Math.round(prediction.confidence * 100)}% confidence
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function Page() {
  const { data: games = [], isLoading: loadingGames } = useSWR<Game[]>("/api/upcoming-games", jsonFetcher);
  const { data: preds = {}, isLoading: loadingPreds } = useSWR<Predictions>("/api/run-predictions", jsonFetcher);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <main className="container py-8 space-y-8">
      <section id="hero" className="space-y-2">
        <h1 className="text-2xl font-semibold">Zero‑to‑One Live Demo</h1>
        <p className="text-muted-foreground">This view streams agent activity when available, or simulates it automatically.</p>
        <Link
          href="#live"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
        >
          Jump to Live ↴
        </Link>
      </section>

      <section id="live" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loadingGames ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            games.map((game) => (
              <GameCard
                key={game.gameId}
                game={game}
                selected={selectedGame?.gameId === game.gameId}
                onSelect={() => setSelectedGame(game)}
                prediction={preds[game.gameId]}
              />
            ))
          )}
        </div>

        {selectedGame && (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Agent Analysis</h2>
            <AgentFlowVisualizer 
              streamUrl={`/api/run-agents?gameId=${selectedGame.gameId}`}
            />
          </Card>
        )}
      </section>
    </main>
  );
}
    </main>
  );
}
    </main>
  );
}
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
