import React, { useState, useEffect } from 'react';
import MatchupInputForm from '../components/MatchupInputForm';
import ExplanationGlossary from '../components/ExplanationGlossary';
import AgentDebugPanel from '../components/AgentDebugPanel';
import AgentSummary from '../components/AgentSummary';
import PickSummary from '../components/PickSummary';
import Footer from '../components/Footer';
import AgentStatusPanel, {
  AgentStatusMap,
} from '../components/AgentStatusPanel';
import UpcomingGamesPanel from '../components/UpcomingGamesPanel';
import {
  AgentOutputs,
  AgentResult,
  Matchup,
  PickSummary as PickSummaryType,
  AgentLifecycle,
} from '../lib/types';
import { agents as agentRegistry } from '../lib/agents/registry';

interface ResultPayload {
  teamA: string;
  teamB: string;
  matchDay: number;
  agents: Partial<AgentOutputs>;
  pick?: PickSummaryType;
  loggedAt?: string;
}

const HomePage: React.FC = () => {
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [showGlossary, setShowGlossary] = useState(true);
  const [highlightAgent, setHighlightAgent] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [showUpcomingGames, setShowUpcomingGames] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<Partial<AgentStatusMap>>({});

  const handleStart = ({ teamA, teamB, matchDay }: { teamA: string; teamB: string; matchDay: number }) => {
    setResult({ teamA, teamB, matchDay, agents: {} });
    const initial: Partial<AgentStatusMap> = {};
    agentRegistry.forEach(({ name }) => {
      initial[name] = { status: 'idle' };
    });
    setAgentStatuses(initial);
  };

  const handleAgent = (name: string, agentResult: AgentResult) => {
    setResult((prev) =>
      prev
        ? { ...prev, agents: { ...prev.agents, [name]: agentResult } }
        : prev
    );
  };

  const handleComplete = ({ matchup, agents, pick, loggedAt }: { matchup: Matchup; agents: AgentOutputs; pick: PickSummaryType; loggedAt?: string }) => {
    setResult({
      teamA: matchup.homeTeam,
      teamB: matchup.awayTeam,
      matchDay: matchup.matchDay!,
      agents,
      pick,
      loggedAt,
    });
  };

  const handleLifecycle = (event: { name: string } & AgentLifecycle) => {
    setAgentStatuses((prev) => ({
      ...prev,
      [event.name]: { status: event.status, durationMs: event.durationMs },
    }));
  };

  const handleSeeUpcomingGames = () => {
    setShowUpcomingGames((s) => !s);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const agent = (e as CustomEvent<string | null>).detail;
      if (agent) {
        setHighlightAgent(agent);
        setShowGlossary(true);
      } else {
        setHighlightAgent(null);
      }
    };
    window.addEventListener('glossary-hover', handler as EventListener);
    return () => window.removeEventListener('glossary-hover', handler as EventListener);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="container max-w-screen-xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-mono font-bold">EdgePicks – AI Matchup Insights for Any Sport.</h1>
          <p
            className="text-gray-600"
            title="Our modular agents make it easy to add support for more sports soon."
          >
            Powered by modular agents — more sports coming soon.
          </p>
          <button onClick={handleSeeUpcomingGames}>
            {showUpcomingGames ? 'Hide Upcoming Games' : '🏈 See Upcoming Games'}
          </button>
        </header>
        {showUpcomingGames && <UpcomingGamesPanel />}
        <MatchupInputForm
          onStart={handleStart}
          onAgent={handleAgent}
          onComplete={handleComplete}
          onLifecycle={handleLifecycle}
        />
        {result && (
          <div className="space-y-6">
            {result.pick && (
              <PickSummary
                teamA={result.teamA}
                teamB={result.teamB}
                winner={result.pick.winner}
                confidence={result.pick.confidence}
              />
            )}
            <AgentSummary agents={result.agents} />
            {showDebug && <AgentDebugPanel agents={result.agents} />}
          </div>
        )}
        {showGlossary && (
          <ExplanationGlossary
            onClose={() => setShowGlossary(false)}
            highlightAgent={highlightAgent}
          />
        )}
      </div>
      <AgentStatusPanel statuses={agentStatuses} />
      <Footer showDebug={showDebug} onToggleDebug={() => setShowDebug((d) => !d)} />
    </main>
  );
};

export default HomePage;
