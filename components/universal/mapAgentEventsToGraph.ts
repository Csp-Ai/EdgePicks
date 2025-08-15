import type { AgentEvent } from "./UniversalAgentInterface";
import type { FlowNode, FlowEdge } from "@/lib/dashboard/useFlowVisualizer";

/**
 * Translate agent lifecycle events to graph nodes/edges.
 *
 * Edges are determined either from explicit dependencies declared on the event
 * metadata (`meta.dependsOn`) or, if absent, by the order in which agents begin
 * execution. This mirrors the runtime behavior where agents are executed in the
 * configured flow order unless specific dependencies override it.
 */
export function toGraph(events: AgentEvent[]): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodeMap = new Map<string, FlowNode>();
  const edges: FlowEdge[] = [];
  const edgeSet = new Set<string>();
  let lastRunning: string | null = null;

  const sorted = [...events].sort((a, b) => a.t - b.t);

  sorted.forEach((e) => {
    const existing =
      nodeMap.get(e.agent) || ({ id: e.agent as any, label: e.agent as any, status: "pending" as const } satisfies FlowNode);

    if (e.status === "running") existing.status = "running";
    if (e.status === "completed") existing.status = "completed";
    if (e.status === "error") existing.status = "errored";

    nodeMap.set(e.agent, existing);

    if (e.status === "running") {
      const dependsRaw = (e.meta as any)?.dependsOn ?? (e.meta as any)?.dependency ?? (e.meta as any)?.deps;
      const depends: string[] | undefined =
        Array.isArray(dependsRaw) ? dependsRaw : dependsRaw ? [dependsRaw] : undefined;

      if (depends && depends.length > 0) {
        depends.forEach((dep) => {
          const id = `${dep}-${e.agent}`;
          if (!edgeSet.has(id)) {
            edges.push({ id, source: dep as any, target: e.agent as any });
            edgeSet.add(id);
          }
        });
      } else if (lastRunning && lastRunning !== e.agent) {
        const id = `${lastRunning}-${e.agent}`;
        if (!edgeSet.has(id)) {
          edges.push({ id, source: lastRunning as any, target: e.agent as any });
          edgeSet.add(id);
        }
      }

      lastRunning = e.agent;
    }
  });

  const nodes = Array.from(nodeMap.values());
  return { nodes, edges };
}
