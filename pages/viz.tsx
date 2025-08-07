import React, { useEffect, useRef, useState } from 'react';
import AgentVizCanvas from '../components/AgentVizCanvas';
import { mockAgentRuns } from '../lib/mock/agentRuns';
import { AgentEvent, PredictionFinal } from '../lib/events/agentEvents';
import { streamAgentRun } from '../lib/mock/streamAgentRun';

const runKeys = Object.keys(mockAgentRuns) as Array<keyof typeof mockAgentRuns>;

const VizPage: React.FC = () => {
  const [selected, setSelected] = useState<typeof runKeys[number]>(runKeys[0]);
  const [playedEvents, setPlayedEvents] = useState<AgentEvent[]>([]);
  const [final, setFinal] = useState<PredictionFinal | null>(null);
  const [speed, setSpeed] = useState(1);
  const [skipAnimations, setSkipAnimations] = useState(false);

  const controllerRef = useRef<ReturnType<typeof streamAgentRun> | null>(null);

  useEffect(() => {
    const run = mockAgentRuns[selected];
    controllerRef.current = streamAgentRun(run, {
      onEvent: (e) =>
        setPlayedEvents((prev) => {
          const next = [...prev, e];
          return next;
        }),
      onDone: (f) => setFinal(f),
    });
    setPlayedEvents([]);
    setFinal(null);
  }, [selected]);

  useEffect(() => {
    controllerRef.current?.setSpeed(speed);
  }, [speed]);

  const currentEvent = playedEvents[playedEvents.length - 1];
  const elapsed = playedEvents.length
    ? playedEvents[playedEvents.length - 1].ts - playedEvents[0].ts
    : 0;

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 items-center">
        <label>
          Run:
          <select
            aria-label="Run selector"
            value={selected}
            onChange={(e) => setSelected(e.target.value as any)}
            className="ml-2 border"
          >
            {runKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => controllerRef.current?.start(speed)}
          className="px-2 py-1 border"
        >
          Play
        </button>
        <button
          onClick={() => controllerRef.current?.pause()}
          className="px-2 py-1 border"
        >
          Pause
        </button>
        <button
          onClick={() => {
            controllerRef.current?.reset();
            setPlayedEvents([]);
            setFinal(null);
          }}
          className="px-2 py-1 border"
        >
          Reset
        </button>
        <label className="ml-4">
          Speed:
          <select
            aria-label="Speed"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="ml-1 border"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
          </select>
        </label>
        <label className="ml-4 flex items-center gap-1">
          <input
            type="checkbox"
            checked={skipAnimations}
            onChange={(e) => setSkipAnimations(e.target.checked)}
            aria-label="Skip animations"
          />
          Skip animations
        </label>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <AgentVizCanvas events={playedEvents} skipAnimations={skipAnimations} />
        </div>
        <div className="w-64 p-2 border">
          <div>Current: {currentEvent?.agentId || '—'}</div>
          {currentEvent?.payload?.score !== undefined && (
            <div>Score: {currentEvent.payload.score}</div>
          )}
          <div>Elapsed: {elapsed}ms</div>
        </div>
      </div>
      {final && (
        <div
          className="mt-4 p-2 border bg-green-100"
          aria-live="polite"
          role="status"
        >
          Final pick: {final.winner} ({Math.round(final.confidence * 100)}%)
        </div>
      )}
    </div>
  );
};

export default VizPage;
