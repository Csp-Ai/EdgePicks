import type { Meta, StoryObj } from '@storybook/react';
import Skeleton from '../components/ui/skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Skeleton',
  component: Skeleton,
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Card: Story = {
  render: () => (
    <div className="w-64 space-y-2 rounded-md border p-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Form: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-10 w-full" />
    </div>
  ),
};
