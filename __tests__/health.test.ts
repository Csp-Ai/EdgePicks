/** @jest-environment node */
import { GET } from '../app/api/health/route';

describe('health API', () => {
  it('returns ok', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('ok');
  });
});
