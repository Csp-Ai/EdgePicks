import React from 'react';
import { useLens } from './LensContext';

interface Props {
  datasetId: string;
  children: React.ReactNode;
}

const LensAnnotation: React.FC<Props> = ({ datasetId, children }) => {
  const { active, open, datasets } = useLens();
  const index = datasets.findIndex((d) => d.id === datasetId);
  if (index === -1) return <>{children}</>;
  return (
    <span className="relative">
      {children}
      {active && (
        <button
          type="button"
          className="ml-1 cursor-pointer text-blue-600 align-super"
          onClick={() => open(datasetId)}
        >
          <sup>{index + 1}</sup>
        </button>
      )}
    </span>
  );
};

export default LensAnnotation;
