import nextDynamic from "next/dynamic";
import Link from "next/link";
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
// Client-only visuals and data panels
const AgentNetwork = nextDynamic(() => import("@/components/visuals/AgentNetwork"), { ssr: false });
const QuickMatchups = nextDynamic(() => import("@/components/predictions/QuickMatchups"), { ssr: false });

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO: Live Agent Network + CTA */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-background/60">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="p-6 sm:p-10 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              AI‑Powered Sports Insights, <span className="text-primary">Explained</span>.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Our specialist agents analyze live odds, injuries, weather, and trends—then show you the why behind every pick.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/predictions" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">
                See Today’s Predictions
              </Link>
              <a href="#how-it-works" className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-accent">
                How It Works
              </a>
            </div>
          </div>
          <div className="min-h-[260px] lg:min-h-[360px]">
            <AgentNetwork />
          </div>
        </div>
      </section>

      {/* QUICK MATCHUPS: bettor fast path */}
      <section aria-labelledby="quick-matchups">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="quick-matchups" className="text-xl font-semibold">Today’s Matchups</h2>
          <Link href="/leaderboard" className="text-sm text-muted-foreground hover:underline">Accuracy & Leaderboard →</Link>
        </div>
        <QuickMatchups />
      </section>

      {/* EXPLAINER */}
      <section id="how-it-works" className="rounded-2xl border p-6 sm:p-8">
        <h2 className="text-xl font-semibold">How EdgePicks Works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          <li className="rounded-lg border p-4">
            <div className="font-medium">1) We Pull Live Data</div>
            <p className="text-sm text-muted-foreground mt-1">Schedules, odds, injuries, weather, and trends.</p>
          </li>
          <li className="rounded-lg border p-4">
            <div className="font-medium">2) Agents Debate</div>
            <p className="text-sm text-muted-foreground mt-1">Independent agents form their own picks and confidence.</p>
          </li>
          <li className="rounded-lg border p-4">
            <div className="font-medium">3) You Get Reasons</div>
            <p className="text-sm text-muted-foreground mt-1">Transparent rationales behind every recommendation.</p>
          </li>
        </ol>
      </section>
    </div>
  );
}
