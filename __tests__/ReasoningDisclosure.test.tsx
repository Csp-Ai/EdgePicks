import { render, screen, fireEvent } from '@testing-library/react';
import ReasoningDisclosure from '../components/agents/ReasoningDisclosure';

describe('ReasoningDisclosure', () => {
  it('toggles reasoning visibility', () => {
    render(
      <ReasoningDisclosure reason="Because it's reasonable">
        Agent Label
      </ReasoningDisclosure>
    );

    const trigger = screen.getByRole('button', { name: /agent label/i });
    const reasoning = screen.getByText("Because it's reasonable");
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(reasoning).not.toBeVisible();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(reasoning).toBeVisible();
  });
});

