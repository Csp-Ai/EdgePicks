import nextDynamic from 'next/dynamic';
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ValueProps from "@/components/ValueProps";
export const revalidate = 60 as const;
export const dynamic = 'auto';
// Defer LiveStatsStrip until visible (example: small component still lazy for demo)
const LiveStatsStrip = nextDynamic(() => import("@/components/LiveStatsStrip"), { ssr: false });

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <TrustBar />
      <ValueProps />
      {/* Wrap in a visibility gate to avoid immediate hydration */}
      <section className="min-h-[120px]" data-defer="visible">
        <LiveStatsStrip />
      </section>
      </div>
  );
}
