import React, { createContext, useContext, useState, ReactNode } from 'react';
import datasets from '../../data/open-datasets.json';

interface Dataset {
  id: string;
  title: string;
  url: string;
  description: string;
}

interface LensContextValue {
  active: boolean;
  toggle: () => void;
  open: (datasetId: string) => void;
  close: () => void;
  selected: Dataset | null;
  datasets: Dataset[];
}

const LensContext = createContext<LensContextValue | undefined>(undefined);

export const LensProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<Dataset | null>(null);

  const toggle = () => setActive((prev) => !prev);
  const open = (datasetId: string) => {
    const ds = datasets.find((d) => d.id === datasetId) || null;
    setSelected(ds);
  };
  const close = () => setSelected(null);

  return (
    <LensContext.Provider value={{ active, toggle, open, close, selected, datasets }}>
      {children}
    </LensContext.Provider>
  );
};

export const useLens = () => {
  const ctx = useContext(LensContext);
  if (!ctx) {
    throw new Error('useLens must be used within LensProvider');
  }
  return ctx;
};

export default LensContext;
