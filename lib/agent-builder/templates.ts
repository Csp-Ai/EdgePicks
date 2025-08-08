import { AgentSpec } from './schema';

export interface AgentTemplate {
  id: string;
  title: string;
  description: string;
  spec: AgentSpec;
}

export const templates: AgentTemplate[] = [
  {
    id: 'parlayFinder',
    title: 'Parlay finder',
    description:
      'Identifies favorable multi-leg opportunities by comparing odds across games.',
    spec: {
      name: 'parlayFinder',
      inputs: ['odds', 'lineMovement'],
      weights: { odds: 0.6, lineMovement: 0.4 },
    },
  },
  {
    id: 'injuryAware',
    title: 'Injury-aware picks',
    description:
      'Highlights matchups where injuries create betting edges.',
    spec: {
      name: 'injuryAware',
      inputs: ['injuryReports', 'depthCharts'],
      weights: { injuryReports: 0.7, depthCharts: 0.3 },
    },
  },
];
