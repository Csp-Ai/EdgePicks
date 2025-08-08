import { freezeTime, resetTime } from '../test/utils/freezeTime';
import { freezeRandom, resetRandom } from '../test/utils/freezeRandom';

describe('deterministic helpers', () => {
  beforeAll(() => {
    freezeTime();
    freezeRandom(1);
  });

  afterAll(() => {
    resetTime();
    resetRandom();
  });

  it('produces stable values', () => {
    const value = {
      now: new Date().toISOString(),
      random: Math.random(),
    };
    expect(value).toMatchSnapshot();
  });
});
