import React, { useEffect, useMemo, useState } from 'react';
import type { Game, PickSummary } from '../lib/types';
import type { AgentExecution as BaseAgentExecution } from '../lib/flow/runFlow';
import AgentNodeGraph from './AgentNodeGraph';
import ConfidenceMeter from './ConfidenceMeter';
import AgentRationalePanel from './AgentRationalePanel';
import PickSummaryComp from './PickSummary';
import useFlowVisualizer from '../lib/dashboard/useFlowVisualizer';
import useEventSource from '../lib/hooks/useEventSource';
import { logUiEvent } from '../lib/logUiEvent';

interface Props {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

interface AgentExecution extends BaseAgentExecution {
  weight?: number;
  description?: string;
  scoreTotal?: number;
  confidenceEstimate?: number;
}

const PredictionDrawer: React.FC<Props> = ({ game, isOpen, onClose }) => {
  const { statuses, handleLifecycleEvent, reset } = useFlowVisualizer();
  const [executions, setExecutions] = useState<AgentExecution[]>([]);
  const [pick, setPick] = useState<PickSummary | null>(null);
  const [confidence, setConfidence] = useState(0);

  const url = useMemo(() => {
    if (!game) return null;
    const week = 1; // placeholder
    const sessionId = typeof window !== 'undefined'
      ? (localStorage.getItem('sessionId') || (() => {
          const id = crypto.randomUUID();
          localStorage.setItem('sessionId', id);
          return id;
        })())
      : '';
    return `/api/run-agents?homeTeam=${encodeURIComponent(
      game.homeTeam
    )}&awayTeam=${encodeURIComponent(game.awayTeam)}&week=${week}&sessionId=${sessionId}`;
  }, [game]);

  const { status: esStatus, lastMessage, reconnect } = useEventSource(
    isOpen ? url : null
  );

  const startRun = () => {
    if (!game) return;
    reset();
    setExecutions([]);
    setPick(null);
    setConfidence(0);
    reconnect();
    void logUiEvent('landingRunPredictions', {
      league: game.league,
      gameId: game.gameId,
      liveMode: process.env.LIVE_MODE,
    });
  };

  useEffect(() => {
    if (isOpen && game) {
      startRun();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, game?.gameId]);

  useEffect(() => {
    if (!lastMessage) return;
    const data = lastMessage;
    if (data.type === 'agent') {
      setExecutions((prev) => [...prev, data]);
      if (data.confidenceEstimate !== undefined) {
        setConfidence(Math.round(data.confidenceEstimate * 100));
      }
    } else if (data.type === 'lifecycle') {
      handleLifecycleEvent(data);
    } else if (data.type === 'summary') {
      setPick(data.pick);
      setConfidence(Math.round(data.pick.confidence * 100));
      void logUiEvent('landingPredictionComplete', {
        winner: data.pick.winner,
        confidence: data.pick.confidence,
      });
    } else if (data.type === 'error') {
      void logUiEvent('landingPredictionError', {
        code: data.code,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  if (!isOpen || !game) return null;

  const share = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-white flex flex-col">
        <header className="p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              {game.homeTeam} vs {game.awayTeam}
            </h2>
            <button onClick={onClose} aria-label="Close" className="text-sm">✕</button>
          </div>
          <div className="text-xs text-gray-500">{new Date(game.time).toLocaleString()}</div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AgentNodeGraph statuses={statuses} />
          {pick ? (
            <PickSummaryComp
              teamA={game.homeTeam}
              teamB={game.awayTeam}
              winner={pick.winner}
              confidence={pick.confidence}
            />
          ) : (
            <ConfidenceMeter
              teamA={{ name: game.homeTeam }}
              teamB={{ name: game.awayTeam }}
              confidence={confidence}
            />
          )}
          {executions.length > 0 && (
            <AgentRationalePanel
              executions={executions as any}
              winner={pick?.winner || ''}
            />
          )}
          {executions.length === 0 && !pick && (
            <div className="space-y-2" data-testid="drawer-skeleton">
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          )}
        </div>
        <footer className="p-4 border-t flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={startRun}
            disabled={esStatus !== 'open'}
          >
            Run again
          </button>
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={share}
            disabled={esStatus !== 'open'}
          >
            Share
          </button>
        </footer>
        <div aria-live="polite" data-testid="a11y-result" className="sr-only">
          {pick ? `${pick.winner} ${Math.round(pick.confidence * 100)}%` : ''}
        </div>
      </div>
    </div>
  );
};

export default PredictionDrawer;
