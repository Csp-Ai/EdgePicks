import outcomes from '../fixtures/agent_outcomes.json';
import { computeReflections } from '../../scripts/agentSelfReflection';

describe('agent self reflection', () => {
  it('computes stats and change hints', () => {
    const reflections = computeReflections(outcomes as any, {
      windowDays: 14,
      timestamp: '2024-01-01T00:00:00.000Z',
    });
    const injury = reflections['injuryScout'];
    expect(injury.samples).toBe(2);
    expect(injury.correctPct).toBeCloseTo(50);
    expect(injury.changeHints).toContain('Calibrate confidence on misses');
  });
});
