import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import PredictionsPanel from '../components/PredictionsPanel';
import type { AgentOutputs } from '../lib/types';

const meta: Meta<typeof PredictionsPanel> = {
  title: 'PredictionsPanel',
  component: PredictionsPanel,
};
export default meta;

type Story = StoryObj<typeof PredictionsPanel>;

const baseProps = {
  agents: {} as AgentOutputs,
  statuses: {},
  nodes: [],
  edges: [],
};

export const Default: Story = {
  args: {
    ...baseProps,
    pick: {
      winner: 'Team A',
      confidence: 0.8,
      topReasons: [],
      reasoning: {
        steps: [
          { title: 'Injury news', detail: 'Key player out' },
          { title: 'Trend matches' },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Reasoning Steps'));
  },
};
