import { formatKickoff, formatAbsolute } from '../lib/utils/formatKickoff';

describe('formatKickoff', () => {
  const base = Date.parse('2025-09-07T12:00:00Z');
  it('minutes', () => {
    expect(formatKickoff('2025-09-07T12:12:00Z', base)).toBe('in 12m');
  });
  it('hours', () => {
    expect(formatKickoff('2025-09-07T15:00:00Z', base)).toBe('in 3h');
  });
  it('days', () => {
    expect(formatKickoff('2025-09-10T12:00:00Z', base)).toBe('in 3d');
  });
  it('started when past', () => {
    expect(formatKickoff('2025-09-07T11:59:30Z', base)).toBe('started');
  });
});

describe('formatAbsolute', () => {
  it('prints a readable absolute', () => {
    expect(formatAbsolute('2025-09-07T12:00:00Z')).toMatch(/Sep|Sept/);
  });
});

