import type { Meta, StoryObj } from '@storybook/react';
import MiniCard from '../../components/agents/MiniCard';
import agents from '../../fixtures/demo/agent-metrics.json';

const meta: Meta<typeof MiniCard> = {
  title: 'Agents/Agent Mini',
  component: MiniCard,
};
export default meta;

type Story = StoryObj<typeof MiniCard>;

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-md">
      {agents.map((a) => (
        <MiniCard
          key={a.name}
          name={a.name}
          score={a.score}
          uncertainty={a.uncertainty}
        />
      ))}
    </div>
  ),
};
