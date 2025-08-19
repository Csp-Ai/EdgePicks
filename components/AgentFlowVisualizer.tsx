import dynamic from 'next/dynamic';

const AgentFlowVisualizerClient = dynamic(
  () => import('./AgentFlowVisualizer.client'),
  { ssr: false }
);

export type { Adapter } from '@/lib/agents/dataAdapter';
export type { AgentNode, AgentLink } from './AgentFlowVisualizer.client';

export default function AgentFlowVisualizer(props: { adapter?: import('@/lib/agents/dataAdapter').Adapter }) {
  return <AgentFlowVisualizerClient {...props} />;
}
