import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const revalidate = 0 as const;
export const dynamic = 'force-dynamic';

export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/logs', req.url), 308);
}
