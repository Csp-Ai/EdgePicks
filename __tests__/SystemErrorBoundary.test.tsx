import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from '../components/system/ErrorBoundary';
import { logEvent } from '../lib/telemetry/logger';

jest.mock('../lib/telemetry/logger', () => ({
  logEvent: jest.fn(),
}));

describe('System ErrorBoundary', () => {
  const logEventMock = logEvent as unknown as jest.Mock;

  afterEach(() => {
    logEventMock.mockClear();
  });

  it('renders fallback and logs once when child throws', () => {
    const Thrower = () => {
      throw new Error('boom');
    };

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByText('Try again')).toBeInTheDocument();
    expect(screen.getByText('Report issue')).toBeInTheDocument();
    expect(logEventMock).toHaveBeenCalledTimes(1);
  });

  it('retries rendering on Try again', () => {
    const Thrower = ({ fail }: { fail: boolean }) => {
      if (fail) {
        throw new Error('boom');
      }
      return <div>safe</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <Thrower fail />
      </ErrorBoundary>
    );

    rerender(
      <ErrorBoundary>
        <Thrower fail={false} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Try again'));

    expect(screen.getByText('safe')).toBeInTheDocument();
  });
});
