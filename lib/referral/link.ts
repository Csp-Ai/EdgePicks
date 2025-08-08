import { createHmac } from 'crypto';

export interface ReferralOptions {
  source: string;
  campaign: string;
  userId?: string;
}

export function makeReferralLink({ source, campaign, userId }: ReferralOptions): string {
  const base = typeof window !== 'undefined' && window.location ? window.location.origin : '';
  const params = new URLSearchParams({
    utm_source: source,
    utm_campaign: campaign,
    utm_medium: 'referral',
  });
  if (userId) {
    params.set('uid', userId);
  }
  const secret = process.env.NEXT_PUBLIC_REFERRAL_SECRET || '';
  const payload = `${source}|${campaign}|${userId ?? ''}`;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  params.set('sig', signature);
  return `${base}/?${params.toString()}`;
}

export default makeReferralLink;
