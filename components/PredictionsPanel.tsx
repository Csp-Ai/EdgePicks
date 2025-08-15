import React, { useEffect, useState } from 'react';
import AgentNodeGraph from './AgentNodeGraph';
import type {
  AgentOutputs,
  AgentLifecycle,
  PickSummary,
  AgentName,
  Reason,
} from '@/lib/types';
import type { FlowNode, FlowEdge } from '@/lib/dashboard/useFlowVisualizer';
import { z } from 'zod';

const ReasoningSchema = z.object({
  steps: z.array(
    z.object({
      title: z.string(),
      detail: z.string().optional(),
    })
  ),
  evidence: z.array(z.string()).optional(),
  caveats: z.array(z.string()).optional(),
});

type PickWithReasoning = PickSummary & {
  reasoning?: unknown;
  betType?: string;
  impliedEdge?: number;
  reasons?: Reason[];
};

const ConfidenceBar: React.FC<{ percent: number; label: string }> = ({
  percent,
  label,
}) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="flex-1 min-w-0 h-2 bg-gray-200 rounded overflow-hidden"
    >
      <div
        className="h-full bg-blue-500 transition-all duration-500 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

interface Props {
  agents: AgentOutputs;
  pick: PickWithReasoning | null;
  statuses: Record<AgentName, { status: AgentLifecycle['status'] | 'idle'; durationMs?: number }>;
  nodes: FlowNode[];
  edges: FlowEdge[];
  cached?: boolean;
}

const PredictionsPanel: React.FC<Props> = ({
  agents,
  pick,
  statuses,
  nodes,
  edges,
  cached,
}) => {
  const [advanced, setAdvanced] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const agentNames = Object.keys(agents) as AgentName[];

  let reasoningData: z.infer<typeof ReasoningSchema> | null = null;
  if (pick?.reasoning) {
    let raw: unknown = pick.reasoning;
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw);
      } catch {
        raw = null;
      }
    }
    if (raw) {
      const parsed = ReasoningSchema.safeParse(raw);
      if (parsed.success) reasoningData = parsed.data;
    }
  }

  const edgePct = pick
    ? pick.impliedEdge ?? (pick.confidence - 0.5) * 100
    : 0;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Matchup Insights</h2>
        <button
          className="text-sm text-blue-500 underline"
          onClick={() => setAdvanced((v) => !v)}
        >
          {advanced ? 'Basic View' : 'Advanced View'}
        </button>
      </div>
      {advanced && <AgentNodeGraph nodes={nodes} edges={edges} />}
      {pick && (
        <div className="p-4 bg-white/10 rounded relative">
          {process.env.NODE_ENV === 'development' && cached && (
            <span className="absolute top-1 right-1 px-2 py-0.5 text-xs rounded bg-green-600 text-white animate-pulse">
              Cached
            </span>
          )}
          <h2 className="text-xl font-semibold">Prediction: {pick.winner}</h2>
          <div className="mt-1 flex items-center gap-2">
            <ConfidenceBar
              percent={pick.confidence * 100}
              label="Overall confidence"
            />
            <span className="text-sm text-gray-300">
              {(pick.confidence * 100).toFixed(0)}%
            </span>
          </div>
          {reasoningData ? (
            <div className="mt-2">
              <button
                className="text-sm text-blue-500 underline"
                onClick={() => setShowReasoning((v) => !v)}
              >
                Reasoning Steps
              </button>
              {showReasoning && (
                <div className="mt-2 space-y-2 text-sm text-gray-300">
                  <ol className="list-decimal list-inside space-y-1">
                    {reasoningData.steps.map((s, i) => (
                      <li key={i}>
                        <span className="font-medium">{s.title}</span>
                        {s.detail && (
                          <p className="text-xs text-gray-400">{s.detail}</p>
                        )}
                      </li>
                    ))}
                  </ol>
                  {reasoningData.evidence && (
                    <div>
                      <p className="font-medium">Evidence</p>
                      <ul className="list-disc list-inside text-xs text-gray-400">
                        {reasoningData.evidence.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {reasoningData.caveats && (
                    <div>
                      <p className="font-medium">Caveats</p>
                      <ul className="list-disc list-inside text-xs text-gray-400">
                        {reasoningData.caveats.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : pick.reasons && pick.reasons.length > 0 ? (
            <ul className="mt-2 list-disc list-inside text-sm text-gray-300">
              {pick.reasons.map((r: Reason, i: number) => (
                <li key={i}>{r.explanation}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-300">No reasoning available</p>
          )}
        </div>
      )}
      {agentNames.length > 0 && (
        <ul className="space-y-2">
          {agentNames.map((name) => {
            const result = agents[name];
            const status = statuses[name]?.status || 'idle';
            return (
              <li key={name} className="p-3 bg-white/5 rounded">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{name}</span>
                  <span className="text-xs text-gray-400">{status}</span>
                </div>
                {result.description && (
                  <p className="text-xs text-gray-400 mb-1">
                    {result.description}
                  </p>
                )}
                <p className="text-sm text-gray-300 mb-1">{result.reason}</p>
                <div className="text-xs text-gray-400 flex flex-wrap gap-2">
                  {typeof result.weight !== 'undefined' && (
                    <span>Weight: {result.weight}</span>
                  )}
                </div>
                {typeof result.confidenceEstimate !== 'undefined' && (
                  <div className="mt-1 flex items-center gap-2">
                    <ConfidenceBar
                      percent={result.confidenceEstimate * 100}
                      label={`${name} confidence`}
                    />
                    <span className="text-xs text-gray-400">
                      {(result.confidenceEstimate * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {pick && (
        <div className="sticky bottom-0 md:static bg-white/5 p-2 rounded text-xs flex justify-between">
          <span>Bet: {pick.betType || 'ML'}</span>
          <span>Conf: {(pick.confidence * 100).toFixed(0)}%</span>
          <span>Edge: {edgePct.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

export default PredictionsPanel;
