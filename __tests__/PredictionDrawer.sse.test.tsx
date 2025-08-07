import { render, screen, act } from '@testing-library/react';
import React from 'react';
import PredictionDrawer from '../components/PredictionDrawer';
import type { Game } from '../lib/types';

jest.mock('../components/PickSummary', () => () => <div />);
jest.mock('../components/AgentNodeGraph', () => () => <div />);
jest.mock('../components/AgentRationalePanel', () => () => <div />);
jest.mock('../components/ConfidenceMeter', () => () => <div />);

class MockEventSource {
  onmessage: ((ev: any) => void) | null = null;
  onerror: (() => void) | null = null;
  close = jest.fn();
  emit(data: any) {
    this.onmessage && this.onmessage({ data: JSON.stringify(data) });
  }
}

describe('PredictionDrawer SSE', () => {
  const originalES = global.EventSource;
  const originalFetch = global.fetch;

  beforeEach(() => {
    Object.defineProperty(global, 'crypto', {
      value: { randomUUID: () => 'uuid' },
      configurable: true,
    });
    (global as any).EventSource = jest.fn(() => new MockEventSource());
    global.fetch = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    (global as any).EventSource = originalES;
    global.fetch = originalFetch as any;
  });

  it('processes events and announces final pick', () => {
    const game: Game = {
      gameId: '1',
      league: 'NFL',
      homeTeam: 'A',
      awayTeam: 'B',
      time: new Date().toISOString(),
    };
    render(<PredictionDrawer game={game} isOpen={true} onClose={() => {}} />);
    const esInstance = (global.EventSource as jest.Mock).mock.results[0].value as MockEventSource;
    act(() => {
      esInstance.emit({
        type: 'agent',
        name: 'injuryScout',
        result: { team: 'A', score: 0.7, reason: 'ok' },
        confidenceEstimate: 0.7,
      });
      esInstance.emit({
        type: 'summary',
        pick: { winner: 'A', confidence: 0.7, topReasons: ['ok'] },
      });
    });
    expect(screen.getByTestId('a11y-result').textContent).toContain('A');
  });
});
