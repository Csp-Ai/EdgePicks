import type { Meta, StoryObj } from '@storybook/react';
import AgentCard from '../../components/AgentCard';

const meta: Meta<typeof AgentCard> = {
  title: 'Agents/Agent Mini',
  component: AgentCard,
};
export default meta;

type Story = StoryObj<typeof AgentCard>;

export const InjuryScout: Story = {
  args: {
    name: 'injuryScout',
    result: {
      team: 'NYK',
      score: 0.82,
      reason: 'Scans injury reports to expose roster gaps.',
    },
    weight: 0.5,
    showWeight: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Flags depth-chart issues before the market adjusts.',
      },
    },
  },
};

export const LineWatcher: Story = {
  args: {
    name: 'lineWatcher',
    result: {
      team: 'BOS',
      score: 0.76,
      reason: 'Monitors sharp line moves across books.',
    },
    weight: 0.3,
    showWeight: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Spots sudden market movement for actionable intel.',
      },
    },
  },
};

export const StatCruncher: Story = {
  args: {
    name: 'statCruncher',
    result: {
      team: 'GSW',
      score: 0.71,
      reason: 'Compares efficiency numbers to find statistical edges.',
    },
    weight: 0.2,
    showWeight: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Runs the numbers to surface underlying trends.',
      },
    },
  },
};

export const TrendsAgent: Story = {
  args: {
    name: 'trendsAgent',
    result: {
      team: 'MIA',
      score: 0.64,
      reason: 'Evaluates recent matchups for momentum shifts.',
    },
    showWeight: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Adds historical context and momentum notes.',
      },
    },
  },
};

export const GuardianAgent: Story = {
  args: {
    name: 'guardianAgent',
    result: {
      team: 'DEN',
      score: 0.5,
      reason: 'Raises warnings on inconsistent inputs.',
      warnings: ['Missing weather data'],
    },
    showWeight: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Keeps picks honest by flagging risky logic.',
      },
    },
  },
};

