import type { Meta, StoryObj } from '@storybook/react';
import Empty from '../components/ui/Empty';

const meta: Meta<typeof Empty> = {
  title: 'UI/Empty',
  component: Empty,
};
export default meta;

type Story = StoryObj<typeof Empty>;

export const EmptyState: Story = {
  args: {
    variant: 'empty',
  },
};

export const ZeroState: Story = {
  args: {
    variant: 'zero',
  },
};

export const PermissionState: Story = {
  args: {
    variant: 'permission',
  },
};
