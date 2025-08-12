import React, { useEffect, useRef, useState } from 'react';
import DemoHero from '@/components/demo/DemoHero';
import MatchupInsights from '@/components/predictions/MatchupInsights';
import { useDemoMode } from '@/lib/demoMode';

const DemoPage: React.FC = () => {
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
    <>
      <DemoHero onStart={handleStart} />
      <div ref={trackerRef}>
        <MatchupInsights />
      </div>
    </>
  );
};

export default DemoPage;
