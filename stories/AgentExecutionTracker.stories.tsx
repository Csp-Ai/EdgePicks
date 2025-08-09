import type { Meta, StoryObj } from '@storybook/react';
import AgentExecutionTracker from '../components/AgentExecutionTracker';

const meta: Meta<typeof AgentExecutionTracker> = {
  title: 'AgentExecutionTracker',
  component: AgentExecutionTracker,
};
export default meta;

type Story = StoryObj<typeof AgentExecutionTracker>;

const agents = [
  { name: 'injuryScout', label: 'Injury Scout' },
  { name: 'lineWatcher', label: 'Line Watcher' },
  { name: 'statCruncher', label: 'Stat Cruncher' },
];

export const Demo: Story = {
  args: {
    agents,
    mode: 'demo',
  },
};
