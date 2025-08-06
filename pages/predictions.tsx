import React, { useState } from 'react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import UpcomingGamesPanel from '../components/UpcomingGamesPanel';
import MatchupInputForm from '../components/MatchupInputForm';
import AgentSummary from '../components/AgentSummary';
import PickSummary from '../components/PickSummary';
import {
  AgentOutputs,
  AgentResult,
  Matchup,
  PickSummary as PickSummaryType,
  AgentLifecycle,
} from '../lib/types';

interface ResultPayload {
  teamA: string;
  teamB: string;
  matchDay: number;
  agents: Partial<AgentOutputs>;
  pick?: PickSummaryType;
}

const PredictionsPage: React.FC = () => {
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [showManual, setShowManual] = useState(false);

  const handleStart = ({
    teamA,
    teamB,
    matchDay,
  }: {
    teamA: string;
    teamB: string;
    matchDay: number;
  }) => {
    setResult({ teamA, teamB, matchDay, agents: {} });
  };

  const handleAgent = (name: string, agentResult: AgentResult) => {
    setResult((prev) =>
      prev ? { ...prev, agents: { ...prev.agents, [name]: agentResult } } : prev
    );
  };

  const handleComplete = ({
    matchup,
    agents,
    pick,
  }: {
    matchup: Matchup;
    agents: AgentOutputs;
    pick: PickSummaryType;
  }) => {
    setResult({
      teamA: matchup.homeTeam,
      teamB: matchup.awayTeam,
      matchDay: matchup.matchDay!,
      agents,
      pick,
    });
  };

  const handleToggleManual = () => setShowManual((s) => !s);
  const handleLifecycle = (_: { name: string } & AgentLifecycle) => {};

  return (
    <main className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="container max-w-screen-xl mx-auto space-y-8">
        <div className="text-center">
          <button
            onClick={handleToggleManual}
            aria-expanded={showManual}
            aria-controls="manual-entry"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            🔀 Switch to Manual Entry
          </button>
        </div>
        <section id="upcoming-games">
          <UpcomingGamesPanel />
        </section>
        <div
          id="manual-entry"
          className={`transition-all duration-300 overflow-hidden ${
            showManual ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0'
          }`}
        >
          <MatchupInputForm
            onStart={handleStart}
            onAgent={handleAgent}
            onComplete={handleComplete}
            onLifecycle={handleLifecycle}
          />
          {result && (
            <div className="space-y-6 mt-6">
              {result.pick && (
                <PickSummary
                  teamA={result.teamA}
                  teamB={result.teamB}
                  winner={result.pick.winner}
                  confidence={result.pick.confidence}
                />
              )}
              <AgentSummary agents={result.agents} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PredictionsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
  return { props: { session } };
};
