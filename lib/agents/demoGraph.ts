import type { AgentNode, AgentLink } from "@/components/AgentFlowVisualizer";

export const demoGraph: { nodes: AgentNode[]; links: AgentLink[] } = {
  nodes: [
    {
      id: "injuryScout",
      label: "Injury Scout",
      role: "scout",
      confidence: 0.82,
      summary: "Scans injury reports and roster depth for advantages.",
      logs: ["Checked latest injury reports", "Flagged questionable RB", "No new injuries"],
    },
    {
      id: "statCruncher",
      label: "Stat Cruncher",
      role: "analyst",
      confidence: 0.74,
      summary: "Crunches historical statistics for trends.",
      logs: ["Parsed efficiency metrics", "Calculated ELO deltas", "Highlighted top offense"],
    },
    {
      id: "lineWatcher",
      label: "Line Watcher",
      role: "arbiter",
      confidence: 0.68,
      summary: "Monitors betting line movement to flag sharp signals.",
      logs: ["Watching line shift", "Detected late steam", "Market stabilised"],
    },
    {
      id: "trendsAgent",
      label: "Trends Agent",
      role: "model",
      confidence: 0.65,
      summary: "Explains recent matchup trends and momentum.",
      logs: ["Outlined win streak", "Noted road performance", "Summarised momentum"],
    },
  ],
  links: [
    { source: "injuryScout", target: "statCruncher", confidence: 0.9 },
    { source: "statCruncher", target: "lineWatcher", confidence: 0.76 },
    { source: "lineWatcher", target: "trendsAgent", confidence: 0.6 },
    { source: "trendsAgent", target: "injuryScout", confidence: 0.7 },
  ],
};

