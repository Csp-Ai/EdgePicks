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
        <sup
          className="ml-1 cursor-pointer text-blue-600"
          onClick={() => open(datasetId)}
        >
          {index + 1}
        </sup>
      )}
    </span>
  );
};

export default LensAnnotation;
