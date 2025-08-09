import { render, act } from '@testing-library/react';
import React from 'react';
import MatchupInputForm from '../components/MatchupInputForm';

class MockEventSource {
  onmessage: ((ev: any) => void) | null = null;
  onerror: (() => void) | null = null;
  close = jest.fn();
  emit(data: any) {
    this.onmessage && this.onmessage({ data: JSON.stringify(data) });
  }
}

describe('MatchupInputForm SSE', () => {
  const originalES = global.EventSource;

  beforeEach(() => {
    (global as any).EventSource = jest.fn(() => new MockEventSource());
    Object.defineProperty(global, 'crypto', {
      value: { randomUUID: () => 'uuid' },
      configurable: true,
    });
    localStorage.clear();
  });

  afterEach(() => {
    (global as any).EventSource = originalES;
  });

  it('handles agent, lifecycle and summary messages', () => {
    const onStart = jest.fn();
    const onAgent = jest.fn();
    const onLifecycle = jest.fn();
    const onComplete = jest.fn();

    render(
      <MatchupInputForm
        onStart={onStart}
        onAgent={onAgent}
        onLifecycle={onLifecycle}
        onComplete={onComplete}
        defaultHomeTeam="A"
        defaultAwayTeam="B"
        defaultWeek={1}
        autostart
      />,
    );

    const es = (global.EventSource as jest.Mock).mock.results[0]
      .value as MockEventSource;

    act(() => {
      es.emit({
        type: 'lifecycle',
        name: 'injuryScout',
        status: 'started',
        startedAt: 1,
      });
      es.emit({
        type: 'agent',
        name: 'injuryScout',
        result: { team: 'A', score: 0.7, reason: 'ok' },
      });
      es.emit({
        type: 'summary',
        matchup: {
          homeTeam: 'A',
          awayTeam: 'B',
          league: 'NFL',
          time: '',
          matchDay: 1,
        },
        agents: {
          injuryScout: { team: 'A', score: 0.7, reason: 'ok' },
        },
        pick: { winner: 'A', confidence: 0.7, topReasons: ['ok'] },
      });
    });

    expect(onStart).toHaveBeenCalledWith({ homeTeam: 'A', awayTeam: 'B', week: 1 });
    expect(onLifecycle).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'lifecycle', name: 'injuryScout' }),
    );
    expect(onAgent).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'injuryScout' }),
    );
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ pick: { winner: 'A', confidence: 0.7, topReasons: ['ok'] } }),
    );
  });
});

