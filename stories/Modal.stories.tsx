import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ModalProps } from '../components/ui/Modal';
import { Button } from '../components/ui/button';

const meta: Meta<typeof Modal> = {
  title: 'Modal',
  component: Modal,
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Open: Story = {
  args: {
    isOpen: true,
    title: 'Example Modal',
    onClose: () => {},
    children: <Button>Close</Button>,
  },
};
