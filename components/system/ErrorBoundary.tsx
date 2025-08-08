import React from 'react';
import BaseErrorBoundary from '../sys/ErrorBoundary';
import { logEvent } from '../../lib/telemetry/logger';

interface Props {
  children: React.ReactNode;
}

/**
 * Application-wide error boundary with retry and issue reporting.
 */
const ErrorBoundary: React.FC<Props> = ({ children }) => (
  <BaseErrorBoundary
    onError={(error) => {
      // Log the error once for telemetry/debugging purposes
      void logEvent({ level: 'error', name: 'error-boundary', meta: { message: error.message } });
    }}
    fallback={(error, reset) => (
      <div
        role="alert"
        className="p-4 text-center bg-red-50 border border-red-200 rounded"
      >
        <p className="mb-4 text-sm text-red-700">Something went wrong.</p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded"
          >
            Try again
          </button>
          <a
            href="https://github.com/EdgePicks/EdgePicks/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded"
          >
            Report issue
          </a>
        </div>
      </div>
    )}
  >
    {children}
  </BaseErrorBoundary>
);

export default ErrorBoundary;
