import React, { useEffect, useRef, useState } from 'react';
import DemoHero from '../../components/demo/DemoHero';
import MatchupInsights, { AgentEvent } from '../../components/MatchupInsights';
import { useDemoMode } from '../../lib/demoMode';

const demoEvents: AgentEvent[] = [
  { id: '1', agent: 'injuryScout', status: 'completed', ts: '' },
  { id: '2', agent: 'lineWatcher', status: 'completed', ts: '' },
  { id: '3', agent: 'statCruncher', status: 'completed', ts: '' },
  { id: '4', agent: 'trendsAgent', status: 'completed', ts: '' },
  { id: '5', agent: 'guardianAgent', status: 'completed', ts: '' },
];

const DemoPage: React.FC = () => {
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

  return (
    <>
      <DemoHero onStart={handleStart} />
      <div ref={trackerRef}>
        <MatchupInsights events={demoEvents} demo />
      </div>
    </>
  );
};

export default DemoPage;
