import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ENV } from './lib/env';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle favicon request
  if (pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    if (pathname === '/api/dev-login' && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    if (ENV.LIVE_MODE === 'on') {
      const isLogs = pathname.startsWith('/api/logs');
      const requiresAuth =
        pathname === '/api/run-agents' ||
        pathname === '/api/run-predictions' ||
        isLogs;
      const isWrite = isLogs && req.method !== 'GET';
      if (requiresAuth && (!isLogs || isWrite)) {
        const token = await getToken({ req, secret: ENV.NEXTAUTH_SECRET });
        if (!token) {
          return new NextResponse(JSON.stringify({ error: 'auth_required' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }
    return NextResponse.next();
  }

  if (pathname === '/' || pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: ENV.NEXTAUTH_SECRET });
  if (!token) {
    const signInUrl = new URL('/auth/signin', req.url);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
