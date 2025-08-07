import { renderHook, act } from '@testing-library/react';
import useEventSource from '../lib/hooks/useEventSource';

describe('useEventSource', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    class MockES {
      onmessage: ((ev: any) => void) | null = null;
      onerror: ((ev: any) => void) | null = null;
      close = jest.fn();
    }
    (global as any).EventSource = jest.fn(() => new MockES());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('retries with backoff and cleans up on unmount', () => {
    const { unmount } = renderHook(() => useEventSource('/sse'));
    const esInstance = (global.EventSource as jest.Mock).mock.results[0].value as any;
    act(() => {
      esInstance.onerror(new Event('error'));
    });
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(global.EventSource).toHaveBeenCalledTimes(2);
    unmount();
    expect(esInstance.close).toHaveBeenCalled();
  });
});
