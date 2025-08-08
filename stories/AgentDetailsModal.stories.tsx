import type { Meta, StoryObj } from '@storybook/react';
import AgentDetailsModal from '../components/AgentDetailsModal';

const meta: Meta<typeof AgentDetailsModal> = {
  title: 'AgentDetailsModal',
  component: AgentDetailsModal,
};

export default meta;

type Story = StoryObj<typeof AgentDetailsModal>;

const agent = {
  name: 'injuryScout',
  purpose: 'Tracks player injuries',
  inputs: ['roster', 'injury reports'],
  outputs: ['score', 'reasoning'],
  weight: 0.5,
  accuracy: 91,
};

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    agent,
  },
};

