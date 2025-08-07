import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  agentId: string;
}

interface LogData {
  output: any;
  reasoning?: string;
  duration?: number;
  error?: string;
  weightedScore?: number;
}

const AgentLogsModal: React.FC<Props> = ({ isOpen, onClose, sessionId, agentId }) => {
  const [tab, setTab] = useState<'raw' | 'score' | 'error'>('raw');
  const [data, setData] = useState<LogData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`/api/logs?sessionId=${encodeURIComponent(sessionId)}&agentId=${encodeURIComponent(agentId)}`)
        .then((res) => res.json())
        .then((d) => setData(d))
        .finally(() => setLoading(false));
    }
  }, [isOpen, sessionId, agentId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    if (!data) {
      return <p className="text-center">No logs found.</p>;
    }
    if (tab === 'raw') {
      return (
        <pre className="text-xs overflow-auto max-h-96 bg-gray-100 p-2 rounded text-gray-800">{JSON.stringify(data.output, null, 2)}</pre>
      );
    }
    if (tab === 'score') {
      return (
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Weighted Score:</span> {data.weightedScore ?? 'N/A'}</p>
          <p><span className="font-semibold">Rationale:</span> {data.reasoning ?? 'N/A'}</p>
          <p><span className="font-semibold">Duration:</span> {data.duration ?? 0}ms</p>
        </div>
      );
    }
    return (
      <pre className="text-xs overflow-auto max-h-96 bg-gray-100 p-2 rounded text-red-700">{data.error}</pre>
    );
  };

  const handleOverlay = () => onClose();
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlay}
    >
      <div
        className="bg-white text-gray-900 w-full max-w-lg rounded shadow-md p-4"
        onClick={handleContentClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{agentId} Logs</h2>
          <Button onClick={handleCopy}>Copy Logs</Button>
        </div>
        <div className="flex space-x-4 mb-4 border-b">
          <button
            className={`pb-2 text-sm ${tab === 'raw' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setTab('raw')}
          >
            Raw Output
          </button>
          <button
            className={`pb-2 text-sm ${tab === 'score' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setTab('score')}
          >
            Score Breakdown
          </button>
          <button
            className={`pb-2 text-sm ${tab === 'error' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setTab('error')}
          >
            Error Trace
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AgentLogsModal;
