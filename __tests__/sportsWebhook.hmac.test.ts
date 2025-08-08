/** @jest-environment node */

import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { createHmac } from 'crypto';

jest.mock('../lib/logToSupabase', () => ({ logToSupabase: jest.fn() }));

const secret = 'test-secret';
process.env.SPORTS_WEBHOOK_SECRET = secret;

const handler = require('../pages/api/sports-webhook').default;
const { logToSupabase } = require('../lib/logToSupabase');

function createReqRes(body: string, signature: string) {
  const req = new Readable() as NextApiRequest;
  req.headers = { 'x-sports-signature': signature } as any;
  req.method = 'POST';
  req.push(body);
  req.push(null);

  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as unknown as NextApiResponse;
  return { req, res, json, status };
}

describe('sports webhook signature verification', () => {
  it('accepts requests with valid signature', async () => {
    const body = JSON.stringify({ hello: 'world' });
    const sig = createHmac('sha256', secret).update(body).digest('hex');
    const { req, res, status, json } = createReqRes(body, sig);

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ received: true });
  });

  it('rejects requests with invalid signature and logs attempt', async () => {
    const body = JSON.stringify({ hello: 'world' });
    const { req, res, status, json } = createReqRes(body, 'bad-signature');

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: 'invalid_signature' });
    expect(logToSupabase).toHaveBeenCalledWith(
      'webhook_events',
      expect.objectContaining({ event: 'invalid_signature' })
    );
  });
});
