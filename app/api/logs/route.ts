import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: Request) {
  // Only allow authenticated users to access logs
  const token = await getToken({ req: request as any });
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.json({
    status: 'running',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  // Only allow authenticated users to post logs
  const token = await getToken({ req: request as any });
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { type, data } = body;

  if (!type || !data) {
    return new NextResponse('Type and data are required', { status: 400 });
  }

  // In production this would write to Supabase
  // For development we write to the filesystem
  if (process.env.NODE_ENV === 'development') {
    const { writeFile } = await import('fs/promises');
    const { join } = await import('path');
    const logsDir = join(process.cwd(), 'logs');
    
    try {
      await writeFile(
        join(logsDir, `${type}-${Date.now()}.json`),
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.error('Failed to write log:', error);
      return new NextResponse('Failed to write log', { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
