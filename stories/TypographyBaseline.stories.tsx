import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Typography/Baseline',
};
export default meta;

type Story = StoryObj;

export const Demo: Story = {
  render: () => (
    <div className="baseline-grid p-4">
      <h1 className="type-h1 baseline-6">Heading One</h1>
      <h2 className="type-h2 baseline-4">Heading Two</h2>
      <p className="type-body baseline-2">
        The quick brown fox jumps over the lazy dog.
      </p>
      <p className="type-body baseline-2">
        Pack my box with five dozen liquor jugs.
      </p>
    </div>
  ),
};
