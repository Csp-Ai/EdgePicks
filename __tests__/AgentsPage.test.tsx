import { render, screen } from '@testing-library/react';
import AgentsPage from '../pages/agents';
import { registry } from '../lib/agents/registry';

describe('AgentsPage', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          history: [
            {
              date: '2024-01-01',
              injuryScout: 50,
              lineWatcher: 60,
              statCruncher: 40,
              trendsAgent: 70,
              guardianAgent: 80,
              overall: 60,
            },
          ],
        }),
    });
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it('renders a tile for each agent', async () => {
    render(<AgentsPage />);
    const tiles = await screen.findAllByTestId('agent-tile');
    expect(tiles).toHaveLength(registry.length);
    expect(screen.getByText('InjuryScout')).toBeInTheDocument();
  });
});
