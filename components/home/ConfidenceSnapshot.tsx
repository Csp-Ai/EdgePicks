"use client";
import useSWR from "swr";
import { apiGet } from "@/lib/api";
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type AccuracyPoint = { date: string; accuracy: number; avgConfidence?: number };
type Leaderboard = { agent: string; winPct: number }[];

export default function ConfidenceSnapshot() {
  const { data: history } = useSWR<AccuracyPoint[]>(
    "/api/accuracy-history",
    (k) => apiGet<AccuracyPoint[]>(k),
    { revalidateOnFocus: false }
  );
  const { data: weekAcc } = useSWR<{ accuracy: number }>(
    "/api/accuracy",
    (k) => apiGet<{ accuracy: number }>(k),
    { revalidateOnFocus: false }
  );
  const { data: lb } = useSWR<Leaderboard>(
    "/api/leaderboard",
    (k) => apiGet<Leaderboard>(k),
    { revalidateOnFocus: false }
  );

  const top3 = (lb ?? []).slice(0, 3);
  const avgAcc = useMemo(() => weekAcc?.accuracy ?? null, [weekAcc]);

  return (
    <section aria-labelledby="conf-acc" className="grid gap-6 lg:grid-cols-3 rounded-2xl border p-4">
      <div className="lg:col-span-2">
        <h2 id="conf-acc" className="text-xl font-semibold mb-3">
          Confidence Trends
        </h2>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history ?? []}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
              <Tooltip formatter={(v) => `${Math.round(Number(v) * 100)}%`} />
              <Line type="monotone" dataKey="accuracy" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-muted-foreground">Last Week’s Accuracy</div>
          <div className="text-2xl font-bold">
            {avgAcc != null ? `${Math.round(avgAcc * 100)}%` : "—"}
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-muted-foreground mb-2">Top Agents (This Week)</div>
          <ul className="text-sm space-y-1">
            {(top3.length ? top3 : [{ agent: "—", winPct: 0 }]).map((a, i) => (
              <li key={`${a.agent}-${i}`} className="flex justify-between">
                <span>{a.agent}</span>
                <span className="text-muted-foreground">
                  {a.winPct ? `${Math.round(a.winPct * 100)}%` : "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

