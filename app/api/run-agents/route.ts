import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ENV } from '@/lib/env';
import { supabase } from '@/lib/supabaseClient';

// Simple in-memory cache
const cache = new Map<string, any>();

export async function POST(request: Request) {
  // Only allow authenticated users
  const token = await getToken({ req: request as any });
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { agentId, input } = body;

  if (!agentId || !input) {
    return new NextResponse('Agent ID and input are required', { status: 400 });
  }

  try {
    // Insert agent run record
    const { data, error } = await supabase
      .from('agent_runs')
      .insert([
        {
          agent_id: agentId,
          input: input,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Return run ID for status polling
    return NextResponse.json({
      runId: data.id,
      status: 'pending'
    });
  } catch (error) {
    console.error('Failed to start agent run:', error);
    return new NextResponse('Failed to start agent run', { status: 500 });
  }
}

export async function GET(request: Request) {
  // Only allow authenticated users
  const token = await getToken({ req: request as any });
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Get run ID from query string
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get('runId');
  const key = searchParams.get('key');
  const prefix = searchParams.get('prefix');

  // Handle cache purge request
  if (key || prefix) {
    if (key) {
      cache.delete(key);
    }
    if (prefix) {
      for (const k of cache.keys()) {
        if (k.startsWith(prefix)) {
          cache.delete(k);
        }
      }
    }
    return NextResponse.json({ success: true });
  }

  // Handle run status request
  if (!runId) {
    return new NextResponse('Run ID is required for status check', { status: 400 });
  }

  try {
    // Get run status
    const { data, error } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (error) throw error;

    return NextResponse.json({
      runId: data.id,
      status: data.status,
      output: data.output
    });
  } catch (error) {
    console.error('Failed to get agent run status:', error);
    return new NextResponse('Failed to get agent run status', { status: 500 });
  }
}
