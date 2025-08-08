import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import type { FlowNode, FlowEdge } from '../lib/dashboard/useFlowVisualizer';
import type { AgentReflection } from '../types/AgentReflection';

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

type ReflectionEntry = { agent: string } & AgentReflection;

const fetcher = async (url: string): Promise<ReflectionEntry[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const AgentNodeGraph: React.FC<Props> = ({ nodes, edges }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<Line[]>([]);

  const {
    data: reflections,
    error,
    isValidating,
  } = useSWR<ReflectionEntry[]>(
    '/api/reflections',
    fetcher,
    {
      dedupingInterval: 60_000,
      errorRetryInterval: 30_000,
      fallbackData: [],
    }
  );

  const computeLines = () => {
    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    const next: Line[] = [];
    edges.forEach((edge) => {
      const source = nodeRefs.current[edge.source];
      const target = nodeRefs.current[edge.target];
      if (!source || !target) return;
      const s = source.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      next.push({
        id: edge.id,
        x1: s.left + s.width / 2 - bounds.left,
        y1: s.top + s.height / 2 - bounds.top,
        x2: t.left + t.width / 2 - bounds.left,
        y2: t.top + t.height / 2 - bounds.top,
      });
    });
    setLines(next);
  };

  useEffect(() => {
    computeLines();
    window.addEventListener('resize', computeLines);
    return () => window.removeEventListener('resize', computeLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  if (nodes.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full overflow-x-auto">
      {error && (
        <div
          role="alert"
          className="absolute top-0 left-0 right-0 bg-red-100 text-red-800 text-sm p-2"
        >
          Failed to load reflections
        </div>
      )}
      {isValidating && !error && (
        <div className="absolute top-0 right-0 p-1 text-xs text-gray-500">
          Refreshing…
        </div>
      )}
      <svg className="absolute inset-0 pointer-events-none w-full h-full">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-gray-500" />
          </marker>
        </defs>
        {lines.map((l) => (
          <line
            key={l.id}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            strokeWidth={2}
            className="stroke-gray-500"
            markerEnd="url(#arrowhead)"
          />
        ))}
      </svg>
      <div className="flex items-center gap-4 p-4 min-w-max">
        {nodes.map((node) => {
          let bg = 'bg-gray-500';
          if (node.status === 'completed') bg = 'bg-green-600';
          else if (node.status === 'errored') bg = 'bg-red-600';
          else if (node.status === 'running') bg = 'bg-blue-600';
          return (
            <motion.div
              key={node.id}
              ref={(el) => {
                nodeRefs.current[node.id] = el;
              }}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xs ${bg}`}
              animate={
                node.status === 'running' ? { scale: 1.1 } : { scale: 1 }
              }
              transition={
                node.status === 'running'
                  ? { repeat: Infinity, repeatType: 'reverse', duration: 0.8 }
                  : {}
              }
            >
              {node.label}
            </motion.div>
          );
        })}
      </div>
      <ul data-testid="reflection-list" className="hidden">
        {reflections?.map((r) => (
          <li key={r.agent}>{r.agent}</li>
        ))}
      </ul>
    </div>
  );
};

export default AgentNodeGraph;

