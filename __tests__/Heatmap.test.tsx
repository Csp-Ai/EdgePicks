import { fireEvent, render, screen } from '@testing-library/react';
import Heatmap from '../components/agents/Heatmap';
import data from './fixtures/heatmap.json';

describe('Heatmap', () => {
  it('renders matrix of agents and signals', () => {
    render(<Heatmap data={data} />);
    expect(
      screen.getByRole('grid', { name: /agent signal heatmap/i })
    ).toBeInTheDocument();
    // Should render cells for each value
    expect(screen.getAllByRole('cell')).toHaveLength(
      data.agents.length * data.signals.length
    );
  });

  it('allows arrow key navigation', () => {
    render(<Heatmap data={data} />);
    const firstCell = screen.getByLabelText('InjuryScout injuries 0.8');
    firstCell.focus();
    fireEvent.keyDown(firstCell, { key: 'ArrowRight' });
    expect(screen.getByLabelText('InjuryScout lines 0.2')).toHaveFocus();
    const secondCell = screen.getByLabelText('InjuryScout lines 0.2');
    fireEvent.keyDown(secondCell, { key: 'ArrowDown' });
    expect(screen.getByLabelText('LineWatcher lines 0.9')).toHaveFocus();
  });
});
