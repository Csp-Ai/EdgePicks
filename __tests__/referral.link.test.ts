import { createHmac } from 'crypto';
import { makeReferralLink } from '../lib/referral/link';

describe('makeReferralLink', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_REFERRAL_SECRET = 'testsecret';
    // JSDOM sets window.location.origin to http://localhost by default
  });

  it('builds link with UTM params and signature', () => {
    const url = makeReferralLink({ source: 'twitter', campaign: 'spring' });
    const params = new URL(url).searchParams;
    expect(params.get('utm_source')).toBe('twitter');
    expect(params.get('utm_campaign')).toBe('spring');
    expect(params.get('utm_medium')).toBe('referral');
    expect(params.get('uid')).toBeNull();
    const expected = createHmac('sha256', 'testsecret')
      .update('twitter|spring|')
      .digest('hex');
    expect(params.get('sig')).toBe(expected);
  });

  it('includes userId when provided', () => {
    const url = makeReferralLink({ source: 'email', campaign: 'summer', userId: 'user123' });
    const params = new URL(url).searchParams;
    expect(params.get('uid')).toBe('user123');
    const expected = createHmac('sha256', 'testsecret')
      .update('email|summer|user123')
      .digest('hex');
    expect(params.get('sig')).toBe(expected);
  });
});
