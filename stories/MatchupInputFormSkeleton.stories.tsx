import type { Meta, StoryObj } from '@storybook/react';
import MatchupInputFormSkeleton from '../components/skeletons/MatchupInputFormSkeleton';

const meta: Meta<typeof MatchupInputFormSkeleton> = {
  title: 'MatchupInputFormSkeleton',
  component: MatchupInputFormSkeleton,
};

export default meta;

type Story = StoryObj<typeof MatchupInputFormSkeleton>;

export const Default: Story = {};

