import React from 'react';
import { useLens } from './LensContext';
import { Button } from '../ui/button';

const LensSideSheet: React.FC = () => {
  const { selected, close } = useLens();
  if (!selected) return null;
  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1" onClick={close} />
      <div className="w-80 max-w-full bg-white text-gray-900 shadow-lg p-4 overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold">{selected.title}</h2>
          <Button onClick={close}>Close</Button>
        </div>
        <p className="mb-2">{selected.description}</p>
        <a
          href={selected.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline break-all"
        >
          {selected.url}
        </a>
      </div>
    </div>
  );
};

export default LensSideSheet;
