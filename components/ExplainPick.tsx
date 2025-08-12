import React, { useState } from 'react';

interface Reason {
  agent: string;
  weight: number;
  explanation: string;
}

interface ExplainPickProps {
  reasons: Reason[];
}

const ExplainPick: React.FC<ExplainPickProps> = ({ reasons }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <button
        className="text-blue-500 hover:underline"
        onClick={togglePanel}
      >
        {isOpen ? 'Hide Explanation' : 'Why this pick?'}
      </button>
      {isOpen && (
        <div className="mt-4 space-y-4">
          {reasons.slice(0, 3).map((reason, index) => (
            <div key={index} className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{reason.agent}:</strong> {reason.explanation}
              </p>
              <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${reason.weight * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplainPick;
