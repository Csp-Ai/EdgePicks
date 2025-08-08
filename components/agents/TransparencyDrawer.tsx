import React, { useEffect, useState } from 'react';

interface AgentDetails {
  id: string;
  weight: number;
  inputs: string;
  output: string;
  uncertainty: string;
  why: string;
  timestamp?: string;
}

interface TransparencyDrawerProps {
  open: boolean;
  details: AgentDetails | null;
  onClose: () => void;
}

/**
 * Right-side drawer displaying immutable agent transparency details.
 */
const TransparencyDrawer: React.FC<TransparencyDrawerProps> = ({
  open,
  details,
  onClose,
}) => {
  const [snapshot, setSnapshot] = useState<AgentDetails | null>(null);

  useEffect(() => {
    if (open && details) {
      // freeze details at open time to keep them immutable
      setSnapshot({ ...details, timestamp: new Date().toISOString() });
    }
  }, [open, details]);

  if (!open || !snapshot) return null;

  return (
    <div className="fixed inset-0 flex justify-end z-40">
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={onClose}
      />
      <aside className="relative w-96 max-w-full h-full bg-white shadow-xl p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{snapshot.id}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="text-sm space-y-2">
          <div>
            <span className="font-medium">Timestamp:</span> {snapshot.timestamp}
          </div>
          <div>
            <span className="font-medium">Inputs:</span> {snapshot.inputs}
          </div>
          <div>
            <span className="font-medium">Weight:</span> {snapshot.weight}
          </div>
          <div>
            <span className="font-medium">Output:</span> {snapshot.output}
          </div>
          <div>
            <span className="font-medium">Uncertainty:</span> {snapshot.uncertainty}
          </div>
          <div>
            <span className="font-medium">Why I said this:</span> {snapshot.why}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TransparencyDrawer;

