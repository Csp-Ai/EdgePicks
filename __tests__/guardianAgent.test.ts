import guardianAgent from '../lib/agents/guardianAgent';

describe('guardianAgent', () => {
  const mockMatchup = {
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    time: new Date().toISOString(),
    league: 'NBA'
  };

  it('validates and processes agent outputs', async () => {
    const mockAgents = {
      statCruncher: {
        team: 'Lakers',
        reason: 'Strong offensive stats',
        confidence: 0.8
      },
      injuryScout: {
        team: 'Lakers',
        reason: 'Key players healthy',
        confidence: 0.7
      }
    };

    const result = await guardianAgent(mockMatchup, mockAgents);
    expect(result.team).toBe('Lakers');
    expect(result.score).toBeGreaterThan(0);
    expect(result.warnings).toBeUndefined();
  });

  it('handles empty agent outputs', async () => {
    const result = await guardianAgent(mockMatchup, {});
    expect(result.warnings).toContain('No agent outputs available for review');
  });

  it('detects disagreements between agents', async () => {
    const conflictingAgents = {
      statCruncher: {
        team: 'Lakers',
        reason: 'Strong offensive stats',
        confidence: 0.8
      },
      injuryScout: {
        team: 'Warriors',
        reason: 'Better defensive matchup',
        confidence: 0.7
      }
    };

    const result = await guardianAgent(mockMatchup, conflictingAgents);
    expect(result.warnings).toContain('Agents disagree on the predicted winner');
  });
});
