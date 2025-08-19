import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const revalidate = 60 as const;
export const dynamic = 'auto';

export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/demo', req.url), 308);
}
