import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Announcer, { useAnnouncer } from '../components/a11y/Announcer';

const DemoButtons = () => {
  const announce = useAnnouncer();
  return (
    <div className="space-x-2">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => announce('Saved', 'polite')}
      >
        Save
      </button>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded"
        onClick={() => announce('Error', 'assertive')}
      >
        Error
      </button>
    </div>
  );
};

const meta: Meta<typeof DemoButtons> = {
  title: 'a11y/Announcer',
  component: DemoButtons,
  decorators: [(Story) => (
    <Announcer>
      <Story />
    </Announcer>
  )],
};

export default meta;

export const Demo: StoryObj<typeof DemoButtons> = {};
