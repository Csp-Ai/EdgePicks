import type { Meta, StoryObj } from '@storybook/react';
import RiskCommunicator from '../../components/health/RiskCommunicator';

const meta: Meta<typeof RiskCommunicator> = {
  title: 'Health/Risk Communicator',
  component: RiskCommunicator,
  args: {
    baseline: 0.1,
    relativeRisk: 0.5,
  },
};

export default meta;

type Story = StoryObj<typeof RiskCommunicator>;

export const Absolute: Story = {
  args: { mode: 'absolute' },
};

export const NNT: Story = {
  args: { mode: 'nnt' },
};

export const Icons: Story = {
  args: { mode: 'icons' },
};

