"use client";

import { useEffect, useRef, useState } from 'react';
import { SWRConfig } from 'swr';
import DemoHero from '@/components/demo/DemoHero';
import MatchupInsights from '@/components/predictions/MatchupInsights';
import { useDemoMode } from '@/lib/demoMode';
import upcoming from '@/fixtures/demo/upcoming.json';

interface Props {
  league?: string;
}

export default function DemoPageClient({ league = 'nfl' }: Props) {
  const enabled = useDemoMode();
  const trackerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    trackerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!enabled || !ready) return null;

  return (
    <SWRConfig value={{ fallback: { '/api/upcoming-games': upcoming } }}>
      <DemoHero onStart={handleStart} />
      <div ref={trackerRef}>
        <MatchupInsights />
      </div>
    </SWRConfig>
  );
}
