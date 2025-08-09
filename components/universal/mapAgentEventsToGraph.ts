import type { AgentEvent } from "./UniversalAgentInterface";
import type { FlowNode, FlowEdge } from "@/lib/dashboard/useFlowVisualizer";

export function toGraph(events: AgentEvent[]): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodeMap = new Map<string, FlowNode>();
  events.forEach((e) => {
    const existing = nodeMap.get(e.agent) || { id: e.agent as any, label: e.agent as any, status: "pending" as const };
    if (e.status === "running") existing.status = "running";
    if (e.status === "completed") existing.status = "completed";
    if (e.status === "error") existing.status = "errored";
    nodeMap.set(e.agent, existing);
  });
  const nodes = Array.from(nodeMap.values());
  const edges: FlowEdge[] = []; // TODO: derive from your flow registry if available
  return { nodes, edges };
}
