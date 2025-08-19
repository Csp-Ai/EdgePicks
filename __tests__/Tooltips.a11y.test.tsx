import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibleTooltip } from '@/components/ui/accessible-tooltip';

describe('AccessibleTooltip', () => {
  it('supports keyboard activation and ESC dismissal', () => {
    render(
      <AccessibleTooltip content="info">
        <button>Trigger</button>
      </AccessibleTooltip>
    );
    const trigger = screen.getByRole('button', { name: /trigger/i });
    trigger.focus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('info');
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(trigger).toHaveAttribute('aria-describedby');
  });
});
