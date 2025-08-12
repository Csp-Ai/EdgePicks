/** @jest-environment node */

const sample = [
  { id: 'a1', name: 'test', weight: 1, enabled: true, desc: 'demo' },
];

const selectMock = jest.fn().mockResolvedValue({ data: sample, error: null });
function fromMock() {
  return { select: selectMock };
}

jest.mock('../lib/db', () => ({
  supabase: { from: fromMock },
}));

const cacheMock = jest.fn((fn: any) => {
  let value: any;
  return async (...args: any[]) => {
    if (value === undefined) {
      value = await fn(...args);
    }
    return value;
  };
});

jest.mock('../lib/server/cache', () => ({ cache: cacheMock }), { virtual: true });

import { getSupabaseAgentRegistry } from '../lib/agents/supabaseRegistry';

describe('getSupabaseAgentRegistry', () => {
  it('fetches agent metadata with caching', async () => {
    const first = await getSupabaseAgentRegistry();
    const second = await getSupabaseAgentRegistry();

    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.data.get('a1')).toEqual(sample[0]);
    expect(second).toBe(first);
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(cacheMock).toHaveBeenCalledTimes(1);
  });
});
