import type { Meta, StoryObj } from '@storybook/react';
import Bar from '../components/viz/Bar';
import Line from '../components/viz/Line';
import Spark from '../components/viz/Spark';

const meta: Meta = {
  title: 'viz/LightweightCharts',
};

export default meta;

type Story = StoryObj;

const sample = [5, 10, 8, 3, 12, 7, 9];

export const Demo: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Bar data={sample} ariaLabel="Sample bar chart" />
      <Line data={sample} ariaLabel="Sample line chart" />
      <Spark data={sample} ariaLabel="Sample spark chart" />
    </div>
  ),
};
