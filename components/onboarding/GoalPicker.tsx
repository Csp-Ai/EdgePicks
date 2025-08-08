import React from 'react';

const OPTIONS = ['Sports Betting', 'Fantasy Sports', 'Other'];

export default function GoalPicker({ onSelect }: { onSelect: (goal: string) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">What will you use the agent for?</h2>
      <div className="space-y-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="w-full px-4 py-2 border rounded hover:bg-blue-600"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
