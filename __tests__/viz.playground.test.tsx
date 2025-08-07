import { render, screen, fireEvent, act } from '@testing-library/react';
import VizPage from '../pages/viz';
import { happyPath } from '../lib/mock/agentRuns';

jest.mock('../components/AgentNodeGraph', () => ({ statuses }: any) => (
  <div data-testid="graph">{Object.keys(statuses).join(',')}</div>
));

jest.useFakeTimers();

describe('Agent viz playground', () => {
  test('streams happy path run', () => {
    render(<VizPage />);
    fireEvent.change(screen.getByLabelText('Run selector'), {
      target: { value: 'happyPath' },
    });
    fireEvent.click(screen.getByText('Play'));
    act(() => {
      jest.advanceTimersByTime(1050);
    });
    expect(screen.getByTestId('node-injuryScout').getAttribute('data-state')).toBe(
      'result'
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    const agents = Array.from(new Set(happyPath.events.map((e) => e.agentId)));
    agents.forEach((id) => {
      expect(screen.getByTestId(`node-${id}`)).toBeInTheDocument();
    });

    expect(screen.getByRole('status')).toHaveTextContent(happyPath.final.winner);
    expect(screen.getByRole('status')).toHaveTextContent(
      String(Math.round(happyPath.final.confidence * 100))
    );

    fireEvent.click(screen.getByLabelText('Skip animations'));
    const node = screen.getByTestId(`node-${agents[0]}`);
    expect(node.className).toContain('no-anim');
  });
});
