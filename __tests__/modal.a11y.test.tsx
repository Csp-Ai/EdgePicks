import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Modal } from '../components/ui/Modal';
import { Open } from '../stories/Modal.stories';

expect.extend(toHaveNoViolations);

describe('Modal accessibility', () => {
  it('has no violations', async () => {
    const { container } = render(<Modal {...Open.args} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
