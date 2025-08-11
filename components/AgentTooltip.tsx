import React from 'react';
import Tooltip from './Tooltip';
import { registry as agentRegistry } from '@/lib/agents/registry';
import { AgentName } from '@/lib/types';
import { formatAgentName } from '@/lib/utils';

interface Props {
  name: AgentName;
  children: React.ReactNode;
  className?: string;
}

const AgentTooltip: React.FC<Props> = ({ name, children, className }) => {
  const meta = agentRegistry.find((a) => a.name === name);
  if (!meta) return <>{children}</>;
  return (
    <Tooltip
      className={className}
      content={
        <div>
          <div className="font-medium">{formatAgentName(name)}</div>
          <p className="mt-1 text-xs leading-snug">{meta.description}</p>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};

export default AgentTooltip;
