import { renderHook, act } from '@testing-library/react';
import {
  TelemetryProvider,
  useTelemetry,
  flushTelemetryQueue,
} from '../lib/telemetry';

describe('TelemetryProvider', () => {
  beforeEach(() => {
    flushTelemetryQueue();
  });

  it('queues events when no provider is mounted', () => {
    const { result } = renderHook(() => useTelemetry());
    act(() => {
      result.current({ type: 'test' });
    });
    expect(flushTelemetryQueue()).toEqual([{ type: 'test' }]);
  });

  it('flushes queued events and forwards new ones when provider is mounted', () => {
    const handler = jest.fn();
    const { result: initial } = renderHook(() => useTelemetry());
    act(() => {
      initial.current({ type: 'queued' });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TelemetryProvider onEvent={handler}>{children}</TelemetryProvider>
    );

    const { result } = renderHook(() => useTelemetry(), { wrapper });

    expect(handler).toHaveBeenCalledWith({ type: 'queued' });

    act(() => {
      result.current({ type: 'new' });
    });

    expect(handler).toHaveBeenCalledWith({ type: 'new' });
    expect(handler).toHaveBeenCalledTimes(2);
    expect(flushTelemetryQueue()).toHaveLength(0);
  });
});
