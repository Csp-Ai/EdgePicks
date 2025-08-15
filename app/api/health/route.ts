export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { ok: true, service: "edgepicks", status: "healthy" },
    {
      status: 200,
      headers: {
        "Cache-Control":
          "public, max-age=15, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}

