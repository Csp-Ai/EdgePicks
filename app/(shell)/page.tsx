import nextDynamic from "next/dynamic";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
// Client components (animation/data hooks)
const AgentNetwork = nextDynamic(() => import("@/components/visuals/AgentNetwork"), { ssr: false });
const LiveAgentPanel = nextDynamic(() => import("@/components/home/LiveAgentPanel"), { ssr: false });
const HomeQuickPicks = nextDynamic(() => import("@/components/home/HomeQuickPicks"), { ssr: false });
const ConfidenceSnapshot = nextDynamic(() => import("@/components/home/ConfidenceSnapshot"), { ssr: false });
const HowItWorks = nextDynamic(() => import("@/components/home/HowItWorks"), { ssr: false });
const StickyNavBar = nextDynamic(() => import("@/components/home/StickyNavBar"), { ssr: false });

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* 1) HERO */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-background/60" id="hero">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="p-6 sm:p-10 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              AI‑Powered Sports Insights, <span className="text-primary">Explained</span>.
            </h1>
            <p className="mt-3 text-muted-foreground">
              See how our expert agents analyze live data to give you smarter picks.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#matchups"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
              >
                See Today’s Predictions
              </a>
              <Link
                href="/demo-0to1"
                className={buttonVariants({ variant: 'ghost' })}
              >
                Live Demo
              </Link>
            </div>
          </div>
          <div className="min-h-[260px] lg:min-h-[360px]">
            <AgentNetwork />
          </div>
        </div>
      </section>

      {/* 2) LIVE AGENT NETWORK PANEL */}
      <LiveAgentPanel />

      {/* 3) QUICK PICKS */}
      <section id="matchups" aria-labelledby="quick-matchups">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="quick-matchups" className="text-xl font-semibold">Today’s Matchups</h2>
          <Link href="/predictions" className="text-sm text-muted-foreground hover:underline">Open Predictions →</Link>
        </div>
        <HomeQuickPicks />
      </section>

      {/* 4) CONFIDENCE TRENDS & ACCURACY */}
      <ConfidenceSnapshot />

      {/* 5) HOW IT WORKS */}
      <HowItWorks />

      {/* 6) STICKY NAV (optional; harmless on desktop) */}
      <StickyNavBar />
    </div>
  );
}

