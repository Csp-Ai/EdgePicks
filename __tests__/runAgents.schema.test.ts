import { parseRunAgentsBody } from '../lib/api/validation/runAgents.schema';

describe('run-agents request body schema', () => {
  test('valid body parses', () => {
    const body = { league: 'NFL', gameId: 'game-1', agents: ['injuryScout'] };
    expect(parseRunAgentsBody(body)).toEqual(body);
  });

  test('league is required', () => {
    expect(() => parseRunAgentsBody({ gameId: 'game-1' })).toThrow(/league required/);
  });

  test('gameId is required', () => {
    expect(() => parseRunAgentsBody({ league: 'NFL' })).toThrow(/gameId required/);
  });

  test('invalid league rejected', () => {
    expect(() => parseRunAgentsBody({ league: 'MLS', gameId: 'game-1' })).toThrow(
      /Invalid enum value/,
    );
  });

  test('invalid agent rejected', () => {
    expect(() =>
      parseRunAgentsBody({ league: 'NFL', gameId: 'game-1', agents: ['badAgent'] }),
    ).toThrow(/Invalid enum value/);
  });
});
