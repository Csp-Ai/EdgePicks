import { GetServerSideProps } from 'next';
import React from 'react';
import { AgentName, AgentOutputs, displayNames } from '../lib/types';
import { getSupabaseClient } from '../lib/supabaseClient';

interface MatchupRow {
  id: string;
  team_a: string;
  team_b: string;
  agents: AgentOutputs;
  pick: {
    winner: string;
    confidence: number;
  };
}

interface HistoryProps {
  matchups: MatchupRow[];
}

const HistoryPage: React.FC<HistoryProps> = ({ matchups }) => {
  return (
    <main className="min-h-screen bg-gray-50 p-6" suppressHydrationWarning>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-mono font-bold">Matchup History</h1>
        <p className="text-gray-600">Previous agent predictions</p>
      </header>
      <div className="space-y-6 max-w-3xl mx-auto">
        {matchups.map((m) => (
          <div key={m.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">
              {m.team_a} <span className="text-gray-400">vs</span> {m.team_b}
            </h3>
            <ul className="space-y-3 mb-4 text-sm">
              {(Object.keys(m.agents) as AgentName[]).map((name) => {
                const result = m.agents[name];
                return (
                  <li key={name} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">
                      {displayNames[name]}: {result.team}
                    </div>
                    <div className="text-xs text-gray-600">
                      Score: {result.score.toFixed(2)} – {result.reason}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="text-sm">
              <span className="font-medium">Winner:</span> {m.pick.winner}
              <span className="ml-2 font-medium">Confidence:</span>{' '}
              {Math.round(m.pick.confidence * 100)}%
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<HistoryProps> = async () => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('matchups')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching matchups', error);
    return { props: { matchups: [] } };
  }

  return {
    props: {
      matchups: data as MatchupRow[],
    },
  };
};

export default HistoryPage;

