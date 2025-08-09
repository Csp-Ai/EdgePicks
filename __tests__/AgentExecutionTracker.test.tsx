import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AgentExecutionTracker, {
  LifecycleEvent,
  AgentMeta,
} from '../components/AgentExecutionTracker';

const agents: AgentMeta[] = [
  { name: 'injuryScout', label: 'Injury' },
  { name: 'lineWatcher', label: 'Lines' },
];

describe('AgentExecutionTracker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('updates status based on events and handles out-of-order and missing agents', () => {
    const { rerender } = render(
      <AgentExecutionTracker agents={agents} events={[]} mode="live" />,
    );
    expect(screen.getByTestId('node-injuryScout')).toHaveAttribute(
      'data-status',
      'pending',
    );

    const events1: LifecycleEvent[] = [
      { name: 'injuryScout', status: 'completed' },
      { name: 'lineWatcher', status: 'running' },
      { name: 'unknown', status: 'running' },
    ];
    rerender(
      <AgentExecutionTracker agents={agents} events={events1} mode="live" />,
    );
    expect(screen.getByTestId('node-injuryScout')).toHaveAttribute(
      'data-status',
      'completed',
    );
    expect(screen.getByTestId('node-lineWatcher')).toHaveAttribute(
      'data-status',
      'running',
    );

    const events2: LifecycleEvent[] = [
      ...events1,
      { name: 'injuryScout', status: 'running' }, // out of order
      { name: 'lineWatcher', status: 'error' },
    ];
    rerender(
      <AgentExecutionTracker agents={agents} events={events2} mode="live" />,
    );
    expect(screen.getByTestId('node-injuryScout')).toHaveAttribute(
      'data-status',
      'completed',
    );
    expect(screen.getByTestId('node-lineWatcher')).toHaveAttribute(
      'data-status',
      'error',
    );
  });

  it('completes flow in demo mode', async () => {
    render(<AgentExecutionTracker agents={agents} events={[]} mode="demo" />);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    await screen.findByTestId('flow-complete');
  });

  it('matches initial snapshot', () => {
    const { container } = render(
      <AgentExecutionTracker agents={agents} events={[]} mode="live" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches final snapshot', () => {
    const { container } = render(
      <AgentExecutionTracker
        agents={agents}
        events={[
          { name: 'injuryScout', status: 'completed' },
          { name: 'lineWatcher', status: 'completed' },
        ]}
        mode="live"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

