import React, { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { registry as agentRegistry } from '../lib/agents/registry';
import type { AgentName, AgentLifecycle } from '../lib/types';
import type { AgentReflection } from '../lib/types';
import LoadingShimmer from './LoadingShimmer';

interface ReflectionMap {
  [key: string]: AgentReflection;
}

interface Props {
  statuses: Record<AgentName, { status: AgentLifecycle['status'] | 'idle' }>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AGENT_NAMES: AgentName[] = agentRegistry.map(
  (a) => a.name as AgentName
);

const AgentNodeGraph: React.FC<Props> = ({ statuses }) => {
  const { data: reflections, error, isLoading } = useSWR<ReflectionMap>(
    '/api/reflections',
    fetcher
  );
  const [hovered, setHovered] = useState<AgentName | null>(null);

  const hasActivity = Object.values(statuses).some((s) => s.status !== 'idle');
  if (!hasActivity) return null;
  if (error) {
    return <p className="text-center text-red-600">Failed to load reflections</p>;
  }
  if (isLoading || !reflections) {
    return <LoadingShimmer />;
  }
  return (
    <div className="flex justify-center flex-wrap gap-4 py-4">
      {AGENT_NAMES.map((name) => {
        const state = statuses[name]?.status || 'idle';
        const reflection = reflections[name];
        let bg = 'bg-blue-600';
        if (state === 'errored') bg = 'bg-red-600';
        return (
          <div key={name} className="relative">
            <motion.div
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              animate={{
                scale: state === 'started' ? 1.1 : 1,
                opacity: state === 'errored' ? 0.4 : 1,
              }}
              transition={{
                repeat: state === 'started' ? Infinity : 0,
                repeatType: 'reverse',
                duration: 0.8,
              }}
              className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center text-xs`}
            >
              {name}
            </motion.div>
            {hovered === name && reflection && (
              <div className="reflection-overlay">
                <p className="font-bold mb-1">{name}</p>
                <p>
                  <span className="font-semibold">Observed:</span>{' '}
                  {reflection.whatIObserved}
                </p>
                <p>
                  <span className="font-semibold">Chose:</span>{' '}
                  {reflection.whatIChose}
                </p>
                <p>
                  <span className="font-semibold">Improve:</span>{' '}
                  {reflection.whatCouldImprove}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AgentNodeGraph;
