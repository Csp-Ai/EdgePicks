import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';

export async function POST(request: Request) {
  if (ENV.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Get JSON from request body
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return new NextResponse('Email is required', { status: 400 });
  }

  // Return mock session for development
  return NextResponse.json({
    user: {
      email,
      name: 'Dev User',
      image: null
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });
}
