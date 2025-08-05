import React, { useEffect, useState } from 'react';
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

const HistoryPage: React.FC = () => {
  const [matchups, setMatchups] = useState<MatchupRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchups = async () => {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('matchups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.error('Error fetching matchups', error);
        setMatchups([]);
      } else {
        setMatchups(data as MatchupRow[]);
      }
      setLoading(false);
    };

    fetchMatchups();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6" suppressHydrationWarning>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-mono font-bold">Matchup History</h1>
        <p className="text-gray-600">Previous agent predictions</p>
      </header>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : matchups.length === 0 ? (
        <p className="text-center text-gray-600">No matchups logged yet</p>
      ) : (
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
      )}
    </main>
  );
};

export default HistoryPage;

