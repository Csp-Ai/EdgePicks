import React from 'react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import FunnelChart, { FunnelDatum } from '@/components/analytics/FunnelChart';

interface Props {
  data: FunnelDatum[];
}

const FunnelsPage: React.FC<Props> = ({ data }) => (
  <div className="p-4">
    <h1 className="text-xl font-bold mb-4">Guest Funnel</h1>
    <FunnelChart data={data} />
  </div>
);

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }

  const { SUPABASE_URL, SUPABASE_KEY } = process.env;
  let funnelData: FunnelDatum[] = [];

  try {
    if (SUPABASE_URL && SUPABASE_KEY) {
      const client = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data } = await client
        .from('ui_events')
        .select('event, metadata')
        .in('event', ['demoStart', 'replayStart', 'onboardingStep']);
      if (data) {
        let demo = 0;
        let replay = 0;
        const steps: Record<number, number> = {};
        data.forEach((row: any) => {
          if (row.event === 'demoStart') demo += 1;
          else if (row.event === 'replayStart') replay += 1;
          else if (row.event === 'onboardingStep') {
            const step = Number(row.metadata?.step ?? 0);
            steps[step] = (steps[step] || 0) + 1;
          }
        });
        funnelData = [
          { name: 'Demo', value: demo },
          { name: 'Replay', value: replay },
          ...Object.keys(steps)
            .sort((a, b) => Number(a) - Number(b))
            .map((s) => ({ name: `Onboarding ${s}`, value: steps[Number(s)] })),
        ];
      }
    }
  } catch {
    // ignore errors and fallback to fixture
  }

  if (funnelData.length === 0) {
    const { default: mock } = await import('../../fixtures/funnels.json');
    funnelData = mock as FunnelDatum[];
  }

  return { props: { data: funnelData } };
};

export default FunnelsPage;
