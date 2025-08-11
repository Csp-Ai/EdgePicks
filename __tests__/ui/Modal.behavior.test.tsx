import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/components/ui/Modal';

describe('Modal behavior', () => {
  it('respects keyboard interactions', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <button>Child</button>
      </Modal>
    );
    const child = screen.getByText('Child');
    child.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClose).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on overlay click and restores focus', async () => {
    const user = userEvent.setup();
    function Wrapper() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Modal isOpen={open} onClose={() => setOpen(false)} title="Dialog">
            <button>Inside</button>
          </Modal>
        </>
      );
    }
    render(<Wrapper />);
    const trigger = screen.getByText('Open');
    await user.click(trigger);
    const inside = await screen.findByText('Inside');
    await user.tab();
    expect(inside).toHaveFocus();
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    expect(trigger).toHaveFocus();
  });
});
