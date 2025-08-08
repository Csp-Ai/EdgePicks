import { formatKickoff } from '../lib/utils/formatKickoff';

describe('formatKickoff', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-08-15T00:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns "started" for past times', () => {
    expect(formatKickoff('2025-08-14T23:00:00Z')).toBe('started');
  });

  it('formats times less than an hour away', () => {
    expect(formatKickoff('2025-08-15T00:30:00Z')).toBe('in 30m');
  });

  it('formats times less than a day away', () => {
    expect(formatKickoff('2025-08-15T03:00:00Z')).toBe('in 3h');
  });

  it('formats times within seven days', () => {
    expect(formatKickoff('2025-08-18T00:00:00Z')).toBe('in 3d');
  });

  it('formats times beyond seven days', () => {
    expect(formatKickoff('2025-08-25T19:30:00Z')).toBe('Aug 25, 7:30 PM');
  });
});
