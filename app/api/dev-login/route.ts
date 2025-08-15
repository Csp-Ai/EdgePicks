import { NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV !== 'production';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!isDev) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { supabaseServer } = await import('@/lib/supabaseClient');
    const supa = supabaseServer();
    void supa;
    void body;
    return NextResponse.json({ ok: true, mode: 'dev' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Internal error' },
      { status: 500 },
    );
  }
}

export async function GET(_req: Request) {
  if (!isDev) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    return NextResponse.json({ ok: true, mode: 'dev' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Internal error' },
      { status: 500 },
    );
  }
}
