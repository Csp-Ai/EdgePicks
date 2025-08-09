import React from 'react';
import { diffWords } from 'diff';

interface Props {
  left: string;
  right: string;
}

const Diff: React.FC<Props> = ({ left, right }) => {
  const parts = diffWords(left, right);

  const renderSide = (side: 'left' | 'right') => (
    <pre className="whitespace-pre-wrap">
      {parts.map((part, idx) => {
        if (side === 'left' && part.added) return null;
        if (side === 'right' && part.removed) return null;
        const highlight = part.added ? 'bg-green-200' : part.removed ? 'bg-red-200' : '';
        return (
          <span key={idx} className={highlight}>
            {part.value}
          </span>
        );
      })}
    </pre>
  );

  return (
    <div className="grid grid-cols-2 gap-4" data-testid="agent-output-diff">
      {renderSide('left')}
      {renderSide('right')}
    </div>
  );
};

export default Diff;
