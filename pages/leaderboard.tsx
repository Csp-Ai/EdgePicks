import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';
import { AgentName, AgentOutputs, displayNames } from '../lib/types';

interface AgentStats {
  name: AgentName;
  correct: number;
  total: number;
  accuracy: number;
}

const agentIcons: Record<AgentName, string> = {
  injuryScout: '🩺',
  lineWatcher: '📈',
  statCruncher: '📊',
};

const LeaderboardPage: React.FC = () => {
  const [stats, setStats] = useState<AgentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('matchups')
        .select('agents, winner, pick');

      if (error || !data) {
        console.error('Error fetching leaderboard data:', error);
        setStats([]);
        setLoading(false);
        return;
      }

      const tallies: Record<AgentName, { correct: number; total: number }> = {
        injuryScout: { correct: 0, total: 0 },
        lineWatcher: { correct: 0, total: 0 },
        statCruncher: { correct: 0, total: 0 },
      };

      data.forEach((row: { agents: AgentOutputs; winner?: string; pick?: { winner?: string } }) => {
        const actualWinner = row.winner || row.pick?.winner;
        if (!actualWinner || !row.agents) return;

        (Object.keys(tallies) as AgentName[]).forEach((name) => {
          const agentPick = row.agents[name]?.team;
          if (agentPick) {
            tallies[name].total += 1;
            if (agentPick === actualWinner) {
              tallies[name].correct += 1;
            }
          }
        });
      });

      const computed: AgentStats[] = (Object.keys(tallies) as AgentName[])
        .map((name) => {
          const { correct, total } = tallies[name];
          return {
            name,
            correct,
            total,
            accuracy: total > 0 ? (correct / total) * 100 : 0,
          };
        })
        .sort((a, b) => b.accuracy - a.accuracy);

      setStats(computed);
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6" suppressHydrationWarning>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-mono font-bold">Agent Leaderboard</h1>
        <p className="text-gray-600">Accuracy of agent predictions</p>
      </header>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : stats.length === 0 ? (
        <p className="text-center text-gray-600">No data available</p>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {stats.map((s, idx) => (
            <div key={s.name} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                <span className="w-6 text-lg font-bold">{idx + 1}</span>
                <span className="text-2xl mr-2">{agentIcons[s.name]}</span>
                <span className="font-semibold">{displayNames[s.name]}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {s.correct}/{s.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded h-4">
                <div
                  className="h-4 bg-blue-500 rounded"
                  style={{ width: `${s.accuracy}%` }}
                />
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                {s.accuracy.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default LeaderboardPage;

