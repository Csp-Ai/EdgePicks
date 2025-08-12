import React, { useState, useEffect } from 'react';

interface AgentFlowAnimationProps {
  runId: string;
  onComplete: (confidence: number) => void;
}

export default function AgentFlowAnimation({ runId, onComplete }: AgentFlowAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [confidence, setConfidence] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 100));
    }, 500);

    if (progress === 100) {
      clearInterval(interval);
      setConfidence(Math.random() * 100); // Simulate confidence score
      onComplete(confidence!);
    }

    return () => clearInterval(interval);
  }, [progress, onComplete]);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Agent Analysis Progress</h3>
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {confidence !== null && (
        <p className="mt-4 text-lg font-semibold">
          Final Confidence Score: {confidence.toFixed(2)}%
        </p>
      )}
    </div>
  );
}
