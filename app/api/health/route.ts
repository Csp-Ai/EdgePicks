export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  return new Response("ok", {
    status: 200,
    headers: { "Cache-Control": "public, max-age=5, s-maxage=5, stale-while-revalidate=30" }
  });
}
