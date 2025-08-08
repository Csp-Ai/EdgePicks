import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PredictionsPanel from '../components/PredictionsPanel';
import type { AgentOutputs } from '../lib/types';

jest.mock('../components/AgentNodeGraph', () => () => <div />);

describe('PredictionsPanel explanations', () => {
  const baseProps = {
    agents: {} as AgentOutputs,
    statuses: {},
    nodes: [],
    edges: [],
  };

  it('renders collapsible reasoning steps when schema valid', () => {
    const pick = {
      winner: 'Team A',
      confidence: 0.8,
      topReasons: [],
      reasoning: {
        steps: [
          { title: 'Injury news', detail: 'Key player out' },
          { title: 'Trend matches' },
        ],
      },
    } as any;

    render(<PredictionsPanel {...baseProps} pick={pick} />);
    const toggle = screen.getByText('Reasoning Steps');
    expect(toggle).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.getByText('Injury news')).toBeInTheDocument();
  });

  it('falls back gracefully on invalid reasoning schema', () => {
    const pick = {
      winner: 'Team A',
      confidence: 0.7,
      topReasons: [],
      reasoning: { foo: 'bar' },
    } as any;

    render(<PredictionsPanel {...baseProps} pick={pick} />);
    expect(screen.getByText('No reasoning available')).toBeInTheDocument();
  });

  it('shows cached badge in development when cached', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const pick = { winner: 'Team A', confidence: 0.6, topReasons: [] } as any;
    render(<PredictionsPanel {...baseProps} pick={pick} cached />);
    const badge = screen.getByText('Cached');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toMatch(/animate-pulse/);
    process.env.NODE_ENV = prev;
  });
});
