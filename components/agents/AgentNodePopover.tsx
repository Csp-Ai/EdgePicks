import React, { useEffect, useRef } from 'react';
import { Button } from '../ui/button';

interface Metrics {
  status: string;
  score?: number;
  durationMs?: number;
}

interface Props {
  agentId: string;
  metrics: Metrics;
  onRunSolo: (id: string) => void;
  onClose: () => void;
  style: React.CSSProperties;
}

const AgentNodePopover: React.FC<Props> = ({
  agentId,
  metrics,
  onRunSolo,
  onClose,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={style}
      className="fixed z-50 bg-white border rounded shadow-md p-3 text-sm"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{agentId}</span>
        <button
          aria-label="Close"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      <div className="space-y-1 mb-2">
        <div>Status: {metrics.status}</div>
        {metrics.score !== undefined && <div>Score: {metrics.score}</div>}
        {metrics.durationMs !== undefined && (
          <div>Duration: {metrics.durationMs}ms</div>
        )}
      </div>
      <Button onClick={() => onRunSolo(agentId)} className="w-full">
        Run Solo
      </Button>
    </div>
  );
};

export default AgentNodePopover;
