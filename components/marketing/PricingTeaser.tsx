import React from 'react';
import { Button } from '../ui/button';

interface PricingTeaserProps {
  isOpen: boolean;
  onUpgrade: () => void;
  onKeepDemo: () => void;
}

const PricingTeaser: React.FC<PricingTeaserProps> = ({
  isOpen,
  onUpgrade,
  onKeepDemo,
}) => {
  if (!isOpen) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onKeepDemo}
      data-testid="pricing-teaser"
    >
      <div
        className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center space-y-4"
        onClick={stopPropagation}
      >
        <h2 className="text-xl font-semibold">Unlock full access</h2>
        <p className="text-sm text-slate-700">
          Upgrade to get unlimited picks and deeper insights.
        </p>
        <Button className="w-full" variant="primaryCTA" onClick={onUpgrade}>
          Upgrade now
        </Button>
        <button
          onClick={onKeepDemo}
          className="w-full px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Keep using demo
        </button>
      </div>
    </div>
  );
};

export default PricingTeaser;
