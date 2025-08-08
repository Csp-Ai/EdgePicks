import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import useProfiler from '../lib/hooks/useProfiler';

jest.mock('../lib/telemetry/logger', () => jest.fn());
import log from '../lib/telemetry/logger';

describe('useProfiler', () => {
  beforeEach(() => {
    (log as jest.Mock).mockClear();
  });

  it('logs mount and update phases when enabled', () => {
    const TestComponent = () => {
      const Profiler = useProfiler('Test', true);
      const [count, setCount] = useState(0);
      return (
        <Profiler>
          <button onClick={() => setCount((c) => c + 1)}>{count}</button>
        </Profiler>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'Test', phase: 'mount' }),
    );

    fireEvent.click(getByText('0'));
    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'Test', phase: 'update' }),
    );
  });

  it('does not log when disabled', () => {
    const TestComponent = () => {
      const Profiler = useProfiler('Test', false);
      const [count, setCount] = useState(0);
      return (
        <Profiler>
          <button onClick={() => setCount((c) => c + 1)}>{count}</button>
        </Profiler>
      );
    };

    const { getByText } = render(<TestComponent />);
    fireEvent.click(getByText('0'));
    expect(log).not.toHaveBeenCalled();
  });
});
