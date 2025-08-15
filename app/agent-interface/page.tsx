import AgentFlowVisualizer from "@/components/AgentFlowVisualizer";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Page() {
  return (
    <div className="p-4">
      <AgentFlowVisualizer />
    </div>
  );
}
