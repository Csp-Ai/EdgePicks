import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgentDetailsModal from '../components/AgentDetailsModal';

describe('AgentDetailsModal', () => {
  const agent = {
    name: 'injuryScout',
    purpose: 'Tracks player injuries',
    inputs: ['roster', 'injury reports'],
    outputs: ['score', 'reasoning'],
    weight: 0.5,
    accuracy: 91,
  };

  it('renders agent details', () => {
    render(<AgentDetailsModal isOpen onClose={() => {}} agent={agent} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(agent.name)).toBeInTheDocument();
    expect(screen.getByText(/Tracks player injuries/i)).toBeInTheDocument();
    expect(screen.getByText(/roster, injury reports/)).toBeInTheDocument();
    expect(screen.getByText(/score, reasoning/)).toBeInTheDocument();
    expect(screen.getByText(/0.5/)).toBeInTheDocument();
    expect(screen.getByText(/91%/)).toBeInTheDocument();
  });

  it('closes on Escape key press', () => {
    const onClose = jest.fn();
    render(<AgentDetailsModal isOpen onClose={onClose} agent={agent} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('traps focus within the modal', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>outside</button>
        <AgentDetailsModal isOpen onClose={() => {}} agent={agent} />
      </>
    );
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveFocus();
    await user.tab();
    expect(closeButton).toHaveFocus();
  });
});

