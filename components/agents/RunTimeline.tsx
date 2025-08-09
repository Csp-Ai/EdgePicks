'use client';

import React, { useEffect, useState } from 'react';
import eventsData from '../../fixtures/replay/agent-events.json';

interface AgentEvent {
  type: 'start' | 'result' | 'end';
  agentId: string;
  ts: number;
  payload?: {
    team: string;
    score: number;
    reason: string;
  };
}

const events: AgentEvent[] = (eventsData as { events: AgentEvent[] }).events;

const RunTimeline: React.FC = () => {
  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (idx >= events.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => {
      setIdx((i) => i + 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [playing, idx]);

  const play = () => {
    if (idx >= events.length - 1) return;
    setPlaying(true);
  };

  const pause = () => setPlaying(false);

  const replay = () => {
    setIdx(-1);
    setPlaying(true);
  };

  return (
    <div className="space-y-4" data-testid="run-timeline">
      <div className="flex space-x-2">
        <button
          onClick={play}
          disabled={playing || idx >= events.length - 1}
          aria-label="play"
          className="px-2 py-1 border rounded"
        >
          Play
        </button>
        <button
          onClick={pause}
          disabled={!playing}
          aria-label="pause"
          className="px-2 py-1 border rounded"
        >
          Pause
        </button>
        <button
          onClick={replay}
          aria-label="replay"
          className="px-2 py-1 border rounded"
        >
          Replay
        </button>
      </div>
      <ol className="relative border-l ml-4">
        {events.map((e, i) => (
          <li
            key={i}
            className={`ml-4 mb-2 ${i <= idx ? 'opacity-100' : 'opacity-30'}`}
            data-testid={i <= idx ? 'past-event' : 'future-event'}
          >
            <div className="text-xs text-gray-500">
              {e.ts} · {e.agentId} · {e.type}
            </div>
            {e.type === 'result' && e.payload && (
              <div className="text-sm">
                {e.payload.team} ({e.payload.score}): {e.payload.reason}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RunTimeline;

