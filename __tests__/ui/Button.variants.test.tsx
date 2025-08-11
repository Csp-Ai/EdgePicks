import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button variants', () => {
  it('primary variant has expected classes', () => {
    const { rerender } = render(<Button variant="primary">Click</Button>);
    const btn = screen.getByRole('button', { name: 'Click' });
    expect(btn).toHaveClass('bg-primary');
    expect(btn).toHaveClass('focus-visible:ring-2', { exact: false });
    rerender(
      <Button variant="primary" disabled>
        Click
      </Button>
    );
    const disabledBtn = screen.getByRole('button', { name: 'Click' });
    expect(disabledBtn).toBeDisabled();
    expect(disabledBtn).toHaveClass('disabled:opacity-50', { exact: false });
  });
});
