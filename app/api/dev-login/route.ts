import { NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV !== 'production';

// In production, export a no-op 404 to avoid evaluating dev logic/env.
export const dynamic = 'force-static';
export const fetchCache = 'force-no-store';

export async function GET() {
  if (!isDev) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Dev-only logic lives inside this block so it never runs/imports in prod.
  const { getPublicSiteUrl } = await import('@/lib/env');
  const site = getPublicSiteUrl();
  return NextResponse.json({ ok: true, site });
}
