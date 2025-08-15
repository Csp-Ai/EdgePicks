export type AgentRole = 'scout' | 'cruncher' | 'arbiter' | 'explainer';

export interface AgentNode {
  id: string;
  role: AgentRole;
  summary: string;
  logs: string[];
  lastEvent: string;
  confidence: number;
}

export interface AgentLink {
  source: string;
  target: string;
  type: 'data' | 'modeling' | 'arbitration' | 'explain';
  confidence: number;
  lastEvent: string;
}

export interface AgentGraph {
  nodes: AgentNode[];
  links: AgentLink[];
}

// Minimal demo graph used when no live data is available.
export function getDemoGraph(): AgentGraph {
  const nodes: AgentNode[] = [
    {
      id: 'injuryScout',
      role: 'scout',
      summary: 'Scans injury reports and roster depth for advantages.',
      logs: ['Checked latest injury reports', 'Flagged questionable RB', 'No new injuries'],
      lastEvent: 'Flagged questionable RB',
      confidence: 0.82,
    },
    {
      id: 'statCruncher',
      role: 'cruncher',
      summary: 'Crunches historical statistics for trends.',
      logs: ['Parsed efficiency metrics', 'Calculated ELO deltas', 'Highlighted top offense'],
      lastEvent: 'Highlighted top offense',
      confidence: 0.74,
    },
    {
      id: 'lineWatcher',
      role: 'arbiter',
      summary: 'Monitors betting line movement to flag sharp signals.',
      logs: ['Watching line shift', 'Detected late steam', 'Market stabilised'],
      lastEvent: 'Detected late steam',
      confidence: 0.68,
    },
    {
      id: 'trendsAgent',
      role: 'explainer',
      summary: 'Explains recent matchup trends and momentum.',
      logs: ['Outlined win streak', 'Noted road performance', 'Summarised momentum'],
      lastEvent: 'Summarised momentum',
      confidence: 0.65,
    },
  ];

  const links: AgentLink[] = [
    {
      source: 'injuryScout',
      target: 'statCruncher',
      type: 'data',
      confidence: 0.9,
      lastEvent: 'Injury update sent',
    },
    {
      source: 'statCruncher',
      target: 'lineWatcher',
      type: 'modeling',
      confidence: 0.76,
      lastEvent: 'Stats packaged for line watch',
    },
    {
      source: 'lineWatcher',
      target: 'trendsAgent',
      type: 'arbitration',
      confidence: 0.6,
      lastEvent: 'Line swing analysed',
    },
    {
      source: 'trendsAgent',
      target: 'injuryScout',
      type: 'explain',
      confidence: 0.7,
      lastEvent: 'Trend context shared',
    },
  ];

  return { nodes, links };
}
