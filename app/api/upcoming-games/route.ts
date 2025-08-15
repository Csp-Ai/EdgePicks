// app/api/upcoming-games/route.ts
export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ENV } from "@/lib/config/env";
import { createClient } from "@supabase/supabase-js";

// Small in-file demo fallback so we don't rely on another import
function demoFallback() {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  return [
    {
      id: "demo-1",
      home: "SEA",
      away: "SF",
      kickoff: new Date(now + 6 * hour).toISOString(),
      odds: { home: null, away: null, total: null },
    },
    {
      id: "demo-2",
      home: "KC",
      away: "BUF",
      kickoff: new Date(now + 24 * hour).toISOString(),
      odds: { home: null, away: null, total: null },
    },
  ];
}

function makePublicClient() {
  const url = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const key = ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

const headers = {
  "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
};

export async function GET() {
  try {
    const supa = makePublicClient();
    if (!supa) {
      // No env: return stable demo so UI doesn't render empty
      return NextResponse.json({ games: demoFallback() }, { status: 200, headers });
    }

    // TODO: wire your real query once the table is ready
    // Example:
    // const { data, error } = await supa.from("upcoming_games").select("*").limit(100);
    // if (error) throw error;
    // return NextResponse.json({ games: data ?? [] }, { status: 200, headers });

    // Temporary safe payload
    return NextResponse.json({ games: [] }, { status: 200, headers });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status: 500, headers }
    );
  }
}

