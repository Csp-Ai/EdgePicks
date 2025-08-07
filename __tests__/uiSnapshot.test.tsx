import { render } from '@testing-library/react';
import React from 'react';

jest.mock('../lib/agents/registry', () => ({
  agents: [
    { name: 'injuryScout', description: '', type: 'injury', weight: 0.5, sources: [] },
  ],
}));

import AgentStatusPanel from '../components/AgentStatusPanel';

describe('AgentStatusPanel UI', () => {
  it('renders default state', () => {
    const { asFragment } = render(
      <AgentStatusPanel statuses={{}} sessionId="test-session" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
