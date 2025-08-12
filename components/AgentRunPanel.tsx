import React, { useEffect, useState } from 'react';
import { retryEventSource } from '@/lib/sse/retryEventSource';

interface AgentRunPanelProps {
  matchupId: string;
}

interface SSEEvent {
  data: string;
}

const AgentRunPanel: React.FC<AgentRunPanelProps> = ({ matchupId }) => {
  const [status, setStatus] = useState<'collect' | 'analyze' | 'decide' | 'completed' | 'error'>('collect');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const streamUrl = `/api/run-agents?matchupId=${matchupId}`;
    const eventSource = retryEventSource(streamUrl);

    eventSource.onmessage = (event: SSEEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'progress') {
          setStatus(data.step);
        } else if (data.type === 'result') {
          setStatus('completed');
          setConfidence(data.confidence);
        }
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
        setError('Stream error');
      }
    };

    eventSource.onerror = () => {
      setError('Stream interrupted. Reconnecting...');
      setReconnecting(true);
      setTimeout(() => setReconnecting(false), 3000);
    };

    return () => {
      eventSource.close();
    };
  }, [matchupId]);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Agent Run Progress</p>
        {error && (
          <div className="text-sm text-red-500">
            {error}
            {reconnecting && <span className="ml-2 text-yellow-500">Reconnecting...</span>}
          </div>
        )}
      </div>
      <div className="flex space-x-4">
        <div className={`flex-1 h-2 rounded ${status === 'collect' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        <div className={`flex-1 h-2 rounded ${status === 'analyze' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        <div className={`flex-1 h-2 rounded ${status === 'decide' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
      </div>
      {status === 'completed' && confidence !== null && (
        <div className="text-center">
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            Pick Confidence: {confidence.toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default AgentRunPanel;
