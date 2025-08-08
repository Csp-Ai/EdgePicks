import { createHmac, timingSafeEqual } from 'crypto';

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  const sigBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return sigBuffer.length === expectedBuffer.length && timingSafeEqual(sigBuffer, expectedBuffer);
}
