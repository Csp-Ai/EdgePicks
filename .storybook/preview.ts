import type { Preview } from '@storybook/react';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: {
      // Enable accessibility checks
    },
    actions: { argTypesRegex: '^on.*' },
  },
};

export default preview;
