"use client";
import dynamicImport from "next/dynamic";
import { useState } from "react";
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const AgentNetwork = dynamicImport(() => import("@/components/visuals/AgentNetwork"), { ssr: false });
const QuickMatchups = dynamicImport(() => import("@/components/predictions/QuickMatchups"), { ssr: false });
const AgentFlowVisualizer = dynamicImport(() => import("@/components/visuals/AgentFlowVisualizer"), { ssr: false });

type FlowEdge = { id: string; source: string; target: string };

export default function DemoZeroToOnePage() {
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  return (
    <div className="space-y-6 p-4">
      <section>
        <QuickMatchups />
      </section>
      <div className="min-h-[280px]">
        <AgentNetwork />
      </div>
      <AgentFlowVisualizer setEdges={setEdges} />
    </div>
  );
}
