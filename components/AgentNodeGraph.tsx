import React from 'react';
import { motion } from 'framer-motion';
import { registry as agentRegistry } from '../lib/agents/registry';
import type { AgentName, AgentLifecycle } from '../lib/types';

interface Props {
  statuses: Record<AgentName, { status: AgentLifecycle['status'] | 'idle' }>;
}

const AgentNodeGraph: React.FC<Props> = ({ statuses }) => {
  const agents = agentRegistry.map((a) => a.name as AgentName);
  const hasActivity = Object.values(statuses).some((s) => s.status !== 'idle');
  if (!hasActivity) return null;
  return (
    <div className="flex justify-center flex-wrap gap-4 py-4">
      {agents.map((name) => {
        const state = statuses[name]?.status || 'idle';
        let bg = 'bg-blue-600';
        if (state === 'errored') bg = 'bg-red-600';
        return (
          <motion.div
            key={name}
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
        );
      })}
    </div>
  );
};

export default AgentNodeGraph;
