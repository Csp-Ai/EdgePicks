import React, { useState } from 'react';
import MatchupInputForm from '../components/MatchupInputForm';
import ExplanationGlossary from '../components/ExplanationGlossary';
import AgentDebugPanel from '../components/AgentDebugPanel';
import AgentSummary from '../components/AgentSummary';
import PickSummary from '../components/PickSummary';
import { AgentOutputs, AgentName } from '../lib/types';

interface ResultPayload {
  teamA: string;
  teamB: string;
  week: number;
  agents: AgentOutputs;
  pick: {
    winner: string;
    confidence: number;
    topReasons: string[];
  };
  loggedAt?: string;
}

const weights: Record<AgentName, number> = {
  injuryScout: 0.5,
  lineWatcher: 0.3,
  statCruncher: 0.2,
};

const HomePage: React.FC = () => {
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [showGlossary, setShowGlossary] = useState(true);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-mono font-bold">EdgePicks – AI Matchup Insights for Any Sport.</h1>
        <p
          className="text-gray-600"
          title="Our modular agents make it easy to add support for more sports soon."
        >
          Powered by modular agents — more sports coming soon.
        </p>
      </header>
      <MatchupInputForm onResult={setResult} />
      {result && (
        <div className="mt-6 space-y-6">
          <PickSummary
            teamA={result.teamA}
            teamB={result.teamB}
            winner={result.pick.winner}
            confidence={result.pick.confidence}
          />
          <AgentSummary agents={result.agents} />
          <AgentDebugPanel agents={result.agents} weights={weights} />
        </div>
      )}
      {showGlossary && <ExplanationGlossary onClose={() => setShowGlossary(false)} />}
    </main>
  );
};

export default HomePage;
