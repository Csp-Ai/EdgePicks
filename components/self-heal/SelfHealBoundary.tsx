import React from 'react';
import ErrorBoundary from '../sys/ErrorBoundary';
import FixSuggestionsChip from './FixSuggestionsChip';

interface SelfHealBoundaryProps {
  children: React.ReactNode;
}

const SelfHealBoundary: React.FC<SelfHealBoundaryProps> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-sm text-red-700">Something went wrong.</p>
        <FixSuggestionsChip />
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);

export default SelfHealBoundary;
