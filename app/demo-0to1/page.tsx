import dynamicImport from "next/dynamic";
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const AgentNetwork = dynamicImport(() => import("@/components/visuals/AgentNetwork"), { ssr: false });
const QuickMatchups = dynamicImport(() => import("@/components/predictions/QuickMatchups"), { ssr: false });
const AgentFlowVisualizer = dynamicImport(() => import("@/components/visuals/AgentFlowVisualizer"), { ssr: false });

export default function DemoZeroToOnePage() {
  return (
    <div className="space-y-6 p-4">
      <section>
        <QuickMatchups />
      </section>
      <div className="min-h-[280px]">
        <AgentNetwork />
      </div>
      <AgentFlowVisualizer />
    </div>
  );
}
