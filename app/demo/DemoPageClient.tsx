"use client";

import { useEffect, useRef, useState } from 'react';
import { SWRConfig } from 'swr';
import DemoHero from '@/components/demo/DemoHero';
import MatchupInsights from '@/components/MatchupInsights';
import { useDemoMode } from '@/lib/demoMode';
import upcoming from '@/fixtures/demo/upcoming.json';
import agentEvents from '@/fixtures/demo/agent-events.json';
import agentsMeta from '@/lib/agents/agents.json';

type AgentEvent = {
  id: string;
  agent: string;
  status: string;
  ts: string;
};

interface Props {
  league?: string;
}

export default function DemoPageClient({ league = 'nfl' }: Props) {
  const { enabled, setEnabled } = useDemoMode();
  const trackerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEnabled(true);
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, [setEnabled]);

  const handleStart = () => {
    trackerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!enabled || !ready) return null;

  const base: AgentEvent[] = (agentEvents.events || [])
    .filter((e: any) => e.type === 'end')
    .map((e: any, idx: number) => ({
      id: String(idx + 1),
      agent: e.agentId,
      status: 'completed',
      ts: String(e.ts),
    }));

  const seen = new Set(base.map((e) => e.agent));
  let ts = base.length ? Number(base[base.length - 1].ts) + 1 : 1;
  for (const agent of agentsMeta as Array<{ name: string }>) {
    if (!seen.has(agent.name)) {
      base.push({
        id: String(base.length + 1),
        agent: agent.name,
        status: 'completed',
        ts: String(ts++),
      });
    }
  }

  const events = base;

  return (
    <SWRConfig value={{ fallback: { '/api/upcoming-games': upcoming } }}>
      <DemoHero onStart={handleStart} />
      <div ref={trackerRef}>
        <MatchupInsights data={{ league, events }} />
      </div>
    </SWRConfig>
  );
}
