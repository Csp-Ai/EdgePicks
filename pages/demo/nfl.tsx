import React, { useEffect, useRef, useState } from 'react';
import type { GetStaticProps } from 'next';
import { SWRConfig } from 'swr';
import DemoHero from '@/components/demo/DemoHero';
import MatchupInsights from '@/components/predictions/MatchupInsights';
import { useDemoMode } from '@/lib/demoMode';
import upcoming from '@/fixtures/demo/upcoming.json';

type Props = {
  fallback: Record<string, unknown>;
};

const DemoNFL: React.FC<Props> = ({ fallback }) => {
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
    <SWRConfig value={{ fallback }}>
      <DemoHero onStart={handleStart} />
      <div ref={trackerRef}>
        <MatchupInsights />
      </div>
    </SWRConfig>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      fallback: {
        '/api/upcoming-games': upcoming,
      },
    },
  };
};

export default DemoNFL;
