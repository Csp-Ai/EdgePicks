import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}

export default async function handler(req: Request) {
  return NextResponse.json({ ok: true }, { status: 200 });
}
