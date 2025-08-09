import type { Meta, StoryObj } from '@storybook/react';
import UniversalAgentInterface from '../components/universal/UniversalAgentInterface';

const meta: Meta<typeof UniversalAgentInterface> = {
  title: 'UniversalAgentInterface',
  component: UniversalAgentInterface,
};
export default meta;

type Story = StoryObj<typeof UniversalAgentInterface>;

export const Demo: Story = {
  args: {},
};
