import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import LiveStatsStrip from "@/components/LiveStatsStrip";

export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <ValueProps />
      <LiveStatsStrip />
    </div>
  );
}
