import React from 'react';
import { AccessibleTooltip } from './ui/accessible-tooltip';
import { cloneElement, isValidElement, ReactElement } from 'react';
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
  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement, {
        className: className ?? children.props.className,
      })
    : <span className={className}>{children}</span>;
  return (
    <AccessibleTooltip
      content={
        <div>
          <div className="font-medium">{formatAgentName(name)}</div>
          <p className="mt-1 text-xs leading-snug">{meta.description}</p>
        </div>
      }
    >
      {trigger}
    </AccessibleTooltip>
  );
};

export default AgentTooltip;
