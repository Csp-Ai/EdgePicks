import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/demo', req.url), 308);
}
