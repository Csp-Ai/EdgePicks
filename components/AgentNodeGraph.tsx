import React from 'react';
import { motion } from 'framer-motion';
import { registry as agentRegistry } from '../lib/agents/registry';
import type { AgentName, AgentLifecycle } from '../lib/types';

interface Props {
  statuses: Record<AgentName, { status: AgentLifecycle['status'] | 'idle' }>;
}

const AgentNodeGraph: React.FC<Props> = ({ statuses }) => {
  const agents = agentRegistry.map((a) => a.name as AgentName);
  if (agents.length === 0) {
    return <div className="text-center text-sm text-gray-400">No agent activity yet</div>;
  }
  return (
    <div className="flex justify-center flex-wrap gap-4 py-4">
      {agents.map((name) => {
        const state = statuses[name]?.status || 'idle';
        return (
          <motion.div
            key={name}
            animate={{
              scale: state === 'completed' ? 1 : 1.1,
              opacity: state === 'errored' ? 0.4 : 1,
            }}
            transition={{ repeat: state === 'started' ? Infinity : 0, duration: 0.8, yoyo: true }}
            className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xs"
          >
            {name}
          </motion.div>
        );
      })}
    </div>
  );
};

export default AgentNodeGraph;
