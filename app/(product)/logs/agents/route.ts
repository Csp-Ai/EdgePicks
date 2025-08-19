import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/logs', req.url), 308);
}
