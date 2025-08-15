// app/api/run-predictions/route.ts
export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const headers = {
  "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
};

/**
 * Minimal, safe handlers so the route is a valid module during build.
 * Wire the real agent/prediction flow later.
 */
export async function GET() {
  return NextResponse.json(
    { ok: true, route: "run-predictions", mode: "edge" },
    { status: 200, headers }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // TODO: invoke your agent pipeline/SSE here and return results
    return NextResponse.json(
      { ok: true, strategy: "stub", received: body ?? null, predictions: [] },
      { status: 200, headers }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Internal error" },
      { status: 500, headers }
    );
  }
}

