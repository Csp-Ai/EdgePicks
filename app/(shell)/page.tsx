import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ValueProps from "@/components/ValueProps";
import LiveStatsStrip from "@/components/LiveStatsStrip";
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <TrustBar />
      <ValueProps />
      <LiveStatsStrip />
    </div>
  );
}
