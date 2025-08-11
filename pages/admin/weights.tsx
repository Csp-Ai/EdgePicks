import React from 'react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { supabase } from '@/lib/supabaseClient';
import { ENV } from '@/lib/env';

interface SnapshotRow {
  agent: string;
  alpha: number;
  beta: number;
  weight: number;
  sample_size: number;
  ts: string;
}

interface Props {
  snapshots: SnapshotRow[];
  flag: string;
}

const WeightsAdminPage: React.FC<Props> = ({ snapshots, flag }) => {
  const toggle = async () => {
    const target = flag === 'on' ? 'off' : 'on';
    await fetch(`/admin/weights?toggle=${target}`);
    window.location.reload();
  };
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Agent Weights Snapshot</h1>
      <button
        className="border px-2 py-1 mb-4"
        onClick={toggle}
      >
        WEIGHTS_DYNAMIC: {flag}
      </button>
      <table className="table-auto border">
        <thead>
          <tr>
            <th className="border px-2">Agent</th>
            <th className="border px-2">Weight</th>
            <th className="border px-2">α</th>
            <th className="border px-2">β</th>
            <th className="border px-2">Samples</th>
            <th className="border px-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map((s, idx) => (
            <tr key={idx}>
              <td className="border px-2">{s.agent}</td>
              <td className="border px-2">{s.weight.toFixed(3)}</td>
              <td className="border px-2">{s.alpha}</td>
              <td className="border px-2">{s.beta}</td>
              <td className="border px-2">{s.sample_size}</td>
              <td className="border px-2">{new Date(s.ts).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
  const toggle = ctx.query.toggle as string | undefined;
  if (toggle === 'on' || toggle === 'off') {
    (ENV as any).WEIGHTS_DYNAMIC = toggle;
  }
  const { data } = await supabase
    .from('agent_weights_snapshot')
    .select('*')
    .order('ts', { ascending: false })
    .limit(20);
  return {
    props: {
      snapshots: data || [],
      flag: ENV.WEIGHTS_DYNAMIC,
    },
  };
};

export default WeightsAdminPage;
