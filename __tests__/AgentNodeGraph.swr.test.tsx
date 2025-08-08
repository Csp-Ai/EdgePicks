import React from 'react';
import { render, screen } from '@testing-library/react';
import AgentNodeGraph from '../components/AgentNodeGraph';

jest.mock('swr');
import useSWR from 'swr';

const useSWRMock = useSWR as jest.Mock;

const nodes = [{ id: 'n1', label: 'N1', status: 'completed' } as any];
const edges: any[] = [];

describe('AgentNodeGraph SWR', () => {
  beforeEach(() => {
    useSWRMock.mockReset();
  });

  it('renders cached data immediately', () => {
    useSWRMock.mockReturnValue({
      data: [
        { agent: 'injuryScout', whatIObserved: '', whatIChose: '', whatCouldImprove: '' },
      ],
      error: undefined,
      isValidating: false,
    });
    render(<AgentNodeGraph nodes={nodes} edges={edges} />);
    expect(screen.getByTestId('reflection-list').textContent).toContain('injuryScout');
  });

  it('shows error banner on fetch failure', () => {
    useSWRMock.mockReturnValue({ data: [], error: new Error('fail'), isValidating: false });
    render(<AgentNodeGraph nodes={nodes} edges={edges} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load reflections');
  });

  it('only shows refresh indicator while revalidating', () => {
    useSWRMock.mockReturnValue({ data: [], error: undefined, isValidating: true });
    const { queryByText, rerender } = render(<AgentNodeGraph nodes={nodes} edges={edges} />);
    expect(queryByText('Refreshing…')).toBeInTheDocument();

    useSWRMock.mockReturnValue({ data: [], error: undefined, isValidating: false });
    rerender(<AgentNodeGraph nodes={nodes} edges={edges} />);
    expect(queryByText('Refreshing…')).not.toBeInTheDocument();
  });
});
