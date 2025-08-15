export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ENV } from "@/lib/config/env";
import { createClient } from "@supabase/supabase-js";
// Optional: demo fallback if envs aren’t present
import { getFallbackMatchups } from "@/lib/utils/fallbackMatchups";

function makePublicClient() {
  const url = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const key = ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET() {
  try {
    const supa = makePublicClient();
    if (!supa) {
      // No env available: don’t crash build; return safe empty/demo data
      return NextResponse.json({ games: getFallbackMatchups?.() ?? [] }, { status: 200 });
    }

    // TODO: replace with your actual query
    // const { data, error } = await supa.from("upcoming_games").select("*").limit(100);
    // if (error) throw error;
    // return NextResponse.json({ games: data ?? [] }, { status: 200 });

    // Temporary safe response to avoid blocking while wiring the table:
    return NextResponse.json({ games: [] }, { status: 200 });
  } catch (err: any) {
    // Never throw hard errors that break build; respond with 500 at runtime
    return NextResponse.json({ error: err?.message ?? "Internal error" }, { status: 500 });
  }
}

