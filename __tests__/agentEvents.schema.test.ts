import { agentRunSchema } from '../lib/events/agentEvents';
import { mockAgentRuns } from '../lib/mock/agentRuns';

describe('agent event schemas', () => {
  test('mock runs validate', () => {
    Object.values(mockAgentRuns).forEach((run) => {
      expect(() => agentRunSchema.parse(run)).not.toThrow();
    });
  });
});
