import React, { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

interface AgentRunStatus {
  status: string;
  output: { confidence: string } | null;
}

interface AgentFlowAnimationProps {
  runId: string;
  onComplete: (confidence: number) => void;
}

const AgentFlowAnimation: React.FC<AgentFlowAnimationProps> = ({ runId, onComplete }) => {
  const [status, setStatus] = useState<string>('pending');
  const [output, setOutput] = useState<string | null>(null);

  useEffect(() => {
    const fetchRunStatus = async () => {
      try {
        const data: AgentRunStatus = await apiGet(`/api/run-agents?runId=${runId}`);
        setStatus(data.status);
        setOutput(data.output?.confidence || null);

        if (data.status === 'completed' && data.output) {
          onComplete(parseFloat(data.output.confidence));
        }
      } catch (error) {
        console.error('Failed to fetch agent run status:', error);
        setStatus('error');
      }
    };

    const interval = setInterval(fetchRunStatus, 3000);
    fetchRunStatus();

    return () => clearInterval(interval);
  }, [runId, onComplete]);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Agent Analysis Progress</h3>
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${(status === 'completed' ? 100 : 0)}%` }}
        ></div>
      </div>
      <p className="mt-4 text-lg font-semibold">
        Status: {status.charAt(0).toUpperCase() + status.slice(1)}
      </p>
      {output && (
        <p className="mt-2 text-md">
          Output: {output}
        </p>
      )}
    </div>
  );
};

export default AgentFlowAnimation;
