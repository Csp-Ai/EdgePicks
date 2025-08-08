import React from 'react';

export interface ProvenanceTagProps {
  /** environment where prediction was generated */
  mode: 'live' | 'demo';
  /** whether the prediction data was freshly computed or served from cache */
  freshness: 'cached' | 'fresh';
  /** human-readable age of the data, e.g. `5m`, `2h`, `2024-03-01` */
  dataAge: string;
  className?: string;
}

const ProvenanceTag: React.FC<ProvenanceTagProps> = ({
  mode,
  freshness,
  dataAge,
  className = '',
}) => {
  return (
    <span
      className={`inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 ${className}`}
    >
      {mode} · {freshness} · {dataAge}
    </span>
  );
};

export default ProvenanceTag;

