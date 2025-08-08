import { useState } from 'react';

const STORAGE_KEY = 'betaRibbonDismissed';

export default function BetaRibbon() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem(STORAGE_KEY);
  });

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="h-10" aria-hidden="true" />
      <div className="fixed top-0 left-0 w-full z-50 bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 text-sm px-4 py-2 flex flex-col sm:flex-row items-center justify-between shadow-md transition-transform motion-reduce:transition-none">
        <span className="text-center w-full sm:text-left">Welcome to EdgePicks Beta — results may shift.</span>
        <button
          onClick={dismiss}
          className="mt-1 sm:mt-0 sm:ml-4 px-3 py-1 rounded bg-emerald-200 dark:bg-emerald-800 hover:opacity-80 transition-opacity motion-reduce:transition-none"
          aria-label="Dismiss beta ribbon"
        >
          Dismiss
        </button>
      </div>
    </>
  );
}
