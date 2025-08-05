import React from 'react';

interface Props {
  reasons: string[];
}

const AgentSummary: React.FC<Props> = ({ reasons }) => (
  <ul className="list-disc list-inside text-sm">
    {reasons.map((reason, idx) => (
      <li key={idx}>{reason}</li>
    ))}
  </ul>
);

export default AgentSummary;
