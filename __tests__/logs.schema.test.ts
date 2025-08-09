/** @jest-environment node */
import { parseLogsQuery } from '../lib/api/validation/logs.schema';

describe('logs query schema', () => {
  it('parses valid query params', () => {
    const result = parseLogsQuery({
      agent: 'injuryScout',
      state: 'processed',
      cursor: 'abc',
      limit: '50',
    });
    expect(result).toEqual({
      agent: 'injuryScout',
      state: 'processed',
      cursor: 'abc',
      limit: 50,
    });
  });

  it('allows missing optional params', () => {
    expect(parseLogsQuery({})).toEqual({});
  });

  it('enforces max limit of 200', () => {
    expect(() => parseLogsQuery({ limit: '201' })).toThrow();
  });

  it('rejects non-numeric limit', () => {
    expect(() => parseLogsQuery({ limit: 'abc' })).toThrow();
  });
});
