import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MatchupInsights, { AgentEvent } from '../components/MatchupInsights';

const baseEvents: AgentEvent[] = [
  { id: '1', agent: 'injuryScout', status: 'completed', ts: '' },
  { id: '2', agent: 'lineWatcher', status: 'completed', ts: '' },
  { id: '3', agent: 'statCruncher', status: 'completed', ts: '' },
  { id: '4', agent: 'trendsAgent', status: 'completed', ts: '' },
  { id: '5', agent: 'guardianAgent', status: 'completed', ts: '' },
];

describe('MatchupInsights AgentExecutionTracker integration', () => {
  it('shows flow complete after events progress and reveals predictions on click', () => {
    const partial: AgentEvent[] = baseEvents.slice(0, 2);
    const { rerender } = render(<MatchupInsights events={partial} demo />);
    expect(screen.queryByTestId('flow-complete')).not.toBeInTheDocument();
    rerender(<MatchupInsights events={baseEvents} demo />);
    expect(screen.getByTestId('flow-complete')).toBeInTheDocument();
    const scroll = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scroll;
    fireEvent.click(screen.getByTestId('reveal-cta'));
    expect(scroll).toHaveBeenCalled();
    expect(screen.getByTestId('predictions-list')).toBeInTheDocument();
  });

  it('makes no network calls in demo mode', () => {
    const fetchMock = jest.fn();
    (global as any).fetch = fetchMock;
    const esMock = jest.fn();
    (global as any).EventSource = esMock;
    render(<MatchupInsights events={baseEvents} demo />);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(esMock).not.toHaveBeenCalled();
  });
});
