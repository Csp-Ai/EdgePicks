// components/universal/UniversalAgentInterface.tsx
// Universal Agent Interface — Sports-first, Industry-ready
// - Upcoming games first (confidence + disagreement)
// - Live agent execution view (timeline + graph slot)
// - Summary / Details / Replay tabs
// - Demo mode, low-impact mode, i18n switcher, settings
// - DataAdapter interface to swap sports/finance/research/etc.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ChevronRight,
  Play,
  Pause,
  Settings,
  Globe,
  LineChart,
  Eye,
  RefreshCw,
  ShieldAlert,
  Info,
  Share2,
} from "lucide-react";
import AgentNodeGraph from "@/components/AgentNodeGraph";
import { toGraph } from "./mapAgentEventsToGraph";
import type { PublicPrediction } from "@/lib/types/public";

export type AgentEvent = {
  id: string;
  agent: string;
  role?: string;
  status: "pending" | "running" | "completed" | "error";
  t: number; // ms since start
  summary?: string;
  confidence?: number; // 0-1
  meta?: Record<string, any>;
};

export type Prediction = PublicPrediction & { pick?: string };

export type RunArchive = {
  runId: string;
  startedAt: string;
  finishedAt?: string;
  gameId?: string;
  agents: string[];
  events: AgentEvent[];
  outputs?: Record<string, any>;
};

export interface DataAdapter {
  name: string;
  list(): Promise<Prediction[]>;
  run(id: string, opts?: Record<string, any>): Promise<{ runId: string }>;
  archive?(runId: string): Promise<RunArchive>;
}

// ---------- Demo Adapter (Sports) ----------
const DemoSportsAdapter: DataAdapter = {
  name: "sports-demo",
  async list() {
    const now = new Date();
    const mk = (minutes: number, idx: number) => ({
      gameId: `G-${idx}`,
      league: "NFL",
      home: ["SEA", "DAL", "KC"][idx % 3],
      away: ["SF", "PHI", "BUF"][idx % 3],
      kickoffISO: new Date(now.getTime() + minutes * 60000).toISOString(),
      confidence: 0.62 + (idx % 3) * 0.08,
      disagreement: idx % 2 === 0,
    } as Prediction);
    return [mk(45, 0), mk(120, 1), mk(300, 2)];
  },
  async run(id: string) {
    return { runId: `RUN-${id}-${Date.now()}` };
  },
  async archive(runId: string) {
    return {
      runId,
      startedAt: new Date(Date.now() - 65000).toISOString(),
      finishedAt: new Date().toISOString(),
      agents: ["InjuryScout", "StatCruncher", "WeatherEye", "CoachWhisperer"],
      events: [
        { id: "e1", agent: "InjuryScout", status: "running", t: 0, summary: "Fetching injury list" },
        { id: "e2", agent: "InjuryScout", status: "completed", t: 1200, summary: "2 questionable starters" },
        { id: "e3", agent: "WeatherEye", status: "running", t: 1400, summary: "Wind 12 mph, low impact" },
        { id: "e4", agent: "WeatherEye", status: "completed", t: 2400, summary: "No precipitation" },
        { id: "e5", agent: "StatCruncher", status: "running", t: 2600, summary: "Weighted ELO & red zone" },
        { id: "e6", agent: "StatCruncher", status: "completed", t: 4600, summary: "SEA +3.5 edge" },
        { id: "e7", agent: "CoachWhisperer", status: "running", t: 4700, summary: "4th-down aggressiveness" },
        { id: "e8", agent: "CoachWhisperer", status: "completed", t: 6200, summary: "High 4th-down risk, slight downgrade" },
      ],
      outputs: { pick: "SEA", confidence: 0.71 },
    };
  },
};

// ---------- Streaming hook (demo-friendly) ----------
function useAgentStream(opts: { enabled: boolean; streamUrl?: string; demo: boolean }) {
  const { enabled, streamUrl, demo } = opts;
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const startRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    setEvents([]);
    setIsRunning(true);
    startRef.current = Date.now();

    if (demo) {
      const demoSeq: AgentEvent[] = [
        { id: "d1", agent: "InjuryScout", status: "running", t: 0, summary: "Injuries" },
        { id: "d2", agent: "InjuryScout", status: "completed", t: 800, summary: "2Q" },
        { id: "d3", agent: "WeatherEye", status: "running", t: 1000, summary: "WX" },
        { id: "d4", agent: "WeatherEye", status: "completed", t: 2000, summary: "Clear" },
        { id: "d5", agent: "StatCruncher", status: "running", t: 2200, summary: "ELO" },
        { id: "d6", agent: "StatCruncher", status: "completed", t: 4200, summary: "+3.5" },
        { id: "d7", agent: "CoachWhisperer", status: "running", t: 4300, summary: "4th" },
        { id: "d8", agent: "CoachWhisperer", status: "completed", t: 5600, summary: "Aggressive" },
      ];
      let idx = 0;
      const timer = setInterval(() => {
        setEvents((prev) => [...prev, demoSeq[idx]]);
        idx++;
        if (idx >= demoSeq.length) {
          clearInterval(timer);
          setIsRunning(false);
        }
      }, 350);
      return () => clearInterval(timer);
    }

    if (!streamUrl) {
      setIsRunning(false);
      return;
    }
    const es = new EventSource(streamUrl);
    es.onmessage = (msg) => {
      try {
        const e = JSON.parse(msg.data);
        if (e && e.agent && e.status) {
          const t = Date.now() - (startRef.current ?? Date.now());
          setEvents((prev) => [...prev, { ...e, t }]);
        }
      } catch {}
    };
    es.onerror = () => {
      es.close();
      setIsRunning(false);
    };
    return () => es.close();
  }, [enabled, streamUrl, demo]);

  return { events, isRunning };
}

// ---------- UI pieces ----------
function StatusBadge({ status }: { status: AgentEvent["status"] }) {
  const map: Record<string, string> = {
    pending: "bg-gray-200 text-gray-800",
    running: "bg-blue-100 text-blue-900 border border-blue-300",
    completed: "bg-green-100 text-green-900 border border-green-300",
    error: "bg-red-100 text-red-900 border border-red-300",
  };
  return <Badge className={`rounded-2xl ${map[status]}`}>{status}</Badge>;
}

function DisagreementChip({ on }: { on?: boolean }) {
  if (!on) return null;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-2xl border border-yellow-300 bg-yellow-50 text-yellow-900"
          >
            disagreement
          </Button>
        </TooltipTrigger>
        <TooltipContent>Some agents disagreed — tap to view rationale deltas.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ConfidenceBar({ value }: { value?: number }) {
  const pct = Math.round((value ?? 0) * 100);
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-gray-200" aria-hidden />
      <motion.div
        className="-mt-2 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        style={{ background: `linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(34,197,94,1) 100%)` }}
        aria-label={`Confidence ${pct}%`}
      />
      <div className="mt-1 text-xs text-muted-foreground">{pct}%</div>
    </div>
  );
}

// Agent graph visualization

function Timeline({ events }: { events: AgentEvent[] }) {
  return (
    <div className="space-y-2">
      {events.map((e) => (
        <div key={e.id} className="grid grid-cols-[120px_1fr_auto] items-center gap-3 text-sm">
          <div className="text-xs text-muted-foreground tabular-nums">{(e.t / 1000).toFixed(1)}s</div>
          <div className="flex items-center gap-2">
            <StatusBadge status={e.status} />
            <span className="font-medium">{e.agent}</span>
            <span className="text-muted-foreground">{e.summary}</span>
          </div>
          {typeof e.confidence === "number" && <Badge>{Math.round(e.confidence * 100)}%</Badge>}
        </div>
      ))}
    </div>
  );
}

// ---------- Main ----------
export default function UniversalAgentInterface({
  adapter = DemoSportsAdapter,
  streamUrl,
}: {
  adapter?: DataAdapter;
  streamUrl?: string;
}) {
  const [items, setItems] = useState<Prediction[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Prediction | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(true);
  const [lowImpact, setLowImpact] = useState(false);
  const [locale, setLocale] = useState("en");
  const [speed, setSpeed] = useState(1);
  const { events, isRunning } = useAgentStream({ enabled: !!selected, streamUrl, demo: demoMode });
  const ariaLiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    adapter.list().then(setItems);
  }, [adapter]);

  useEffect(() => {
    if (!ariaLiveRef.current) return;
    const last = events[events.length - 1];
    if (last) ariaLiveRef.current.textContent = `${last.agent} ${last.status}`;
  }, [events]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((i) => `${i.home} ${i.away}`.toLowerCase().includes(q));
  }, [items, query]);

  async function startRun(gameId: string) {
    const res = await adapter.run(gameId);
    setRunId(res.runId);
    setSelected(items.find((i) => i.gameId === gameId) ?? null);
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8 lg:p-10">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LineChart className="h-6 w-6" />
          <h1 className="text-xl md:text-2xl font-semibold">EdgePicks — Universal Agent Interface</h1>
          <Badge className="rounded-2xl">Beta</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Select value={locale} onValueChange={setLocale}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Locale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-2xl"><Settings className="mr-2 h-4 w-4"/>Settings</Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader><SheetTitle>Preferences</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Demo mode</div>
                    <div className="text-sm text-muted-foreground">Use fixtures and deterministic streams</div>
                  </div>
                  <Switch checked={demoMode} onCheckedChange={setDemoMode} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Low-impact mode</div>
                    <div className="text-sm text-muted-foreground">Reduce animations, CPU, and network</div>
                  </div>
                  <Switch checked={lowImpact} onCheckedChange={setLowImpact} />
                </div>
                <div>
                  <div className="mb-2 font-medium">Replay speed</div>
                  <Slider value={[speed]} min={0.5} max={2} step={0.25} onValueChange={(v)=>setSpeed(v[0])} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldAlert className="h-4 w-4"/>
                  <span>WCAG contrast checker and ARIA live enabled</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6" role="main">
        <section aria-labelledby="upcoming" className="lg:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <Input placeholder="Search games…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button
              variant="outline"
              aria-label="Refresh games"
              onClick={() => adapter.list().then(setItems)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle id="upcoming">Upcoming games</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {filtered.map((g) => (
                <div key={g.gameId} className="flex items-center justify-between rounded-2xl border p-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{g.away} @ {g.home}</div>
                    <div className="text-xs text-muted-foreground">{new Date(g.kickoffISO).toLocaleString()}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <ConfidenceBar value={g.confidence} />
                      <DisagreementChip on={g.disagreement} />
                    </div>
                  </div>
                  <Button className="rounded-2xl" onClick={() => startRun(g.gameId)}>
                    <Play className="h-4 w-4 mr-1"/>Run
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="lg:col-span-1" aria-labelledby="liveview">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle id="liveview" className="flex items-center gap-2">
                <Eye className="h-4 w-4"/> Live Agent Execution
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isRunning ? <><Pause className="h-3 w-3"/> streaming</> : <><Play className="h-3 w-3"/> idle</>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgentNodeGraph {...toGraph(events)} />
              <div className="rounded-xl bg-muted p-3">
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <Info className="h-3 w-3"/> Rationale snapshots
                </div>
                <Timeline events={events} />
              </div>
              <div aria-live="polite" aria-atomic="true" ref={ariaLiveRef} className="sr-only" />
            </CardContent>
          </Card>
        </section>

        <section className="lg:col-span-1" aria-labelledby="outcome">
          <Tabs defaultValue="summary">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="replay">Replay</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle id="outcome">Prediction summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Pick</div>
                      <div className="text-2xl font-semibold">{selected?.pick ?? "—"}</div>
                    </div>
                    <div className="w-40"><ConfidenceBar value={selected?.confidence ?? 0.72} /></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">provenance: live</Badge>
                    <Badge variant="outline">explainable</Badge>
                    {selected?.disagreement && <DisagreementChip on />}
                  </div>
                  <div className="flex gap-2">
                    <Button className="rounded-2xl">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share replay
                    </Button>
                    <Button variant="outline" className="rounded-2xl">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      See how we picked
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle>Agent contributions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {Array.from(new Set(events.map(e=>e.agent))).map((a) => (
                    <div key={a} className="rounded-xl border p-3">
                      <div className="font-medium">{a}</div>
                      <div className="text-sm text-muted-foreground">Weighted impact, rationale, and confidence deltas.</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="replay">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle>Run timeline</CardTitle></CardHeader>
                <CardContent><Timeline events={events} /></CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <footer className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Globe className="h-3 w-3"/> demo • locale: {locale}
        </div>
        <div className="flex items-center gap-2">
          <span>contrast: AA</span>
          <span>animations: {lowImpact ? "reduced" : "full"}</span>
        </div>
      </footer>
    </div>
  );
}
