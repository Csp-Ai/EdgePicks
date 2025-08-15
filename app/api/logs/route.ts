import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabaseServer } from '@/lib/supabaseClient';
import { ENV } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

function streamResponse(readable: ReadableStream): Response {
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export async function GET(request: Request) {
  // Authenticate request
  const token = await getToken({ req: request as any });
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const runId = searchParams.get('runId');

  if (!runId) {
    return new NextResponse('Run ID is required', { status: 400 });
  }

  try {
    const supabase = supabaseServer();

    // Create a stream for SSE
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('agent_runs')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agent_runs',
          filter: `id=eq.${runId}`,
        },
        async (payload) => {
          try {
            const data = JSON.stringify(payload.new);
            await writer.write(new TextEncoder().encode(`data: ${data}\n\n`));

            // Close stream if agent run is complete
            if (['completed', 'error'].includes(payload.new.status)) {
              await writer.close();
            }
          } catch (error) {
            console.error('Error writing to stream:', error);
            await writer.close();
          }
        }
      )
      .subscribe();

    // Clean up subscription when client disconnects
    request.signal.addEventListener('abort', () => {
      channel.unsubscribe();
    });

    return streamResponse(stream.readable);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Internal error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Authenticate request
  const token = await getToken({ req: request as any });
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { type, data } = body;

  if (!type || !data) {
    return new NextResponse('Type and data are required', { status: 400 });
  }

  try {
    const supabase = supabaseServer();

    // Log to Supabase
    const { error } = await supabase
      .from(type)
      .insert([
        {
          ...data,
          environment: ENV.NODE_ENV,
          timestamp: new Date().toISOString(),
        },
      ]);

    if (error) {
      throw error;
    }

    return new NextResponse('Logged successfully', { status: 200 });
  } catch (err: any) {
    console.error('Error logging data:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Error logging data' },
      { status: 500 }
    );
  }
}
