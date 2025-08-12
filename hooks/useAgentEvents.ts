import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { AgentEventUpdate } from '@/types/agent';

export function useAgentEvents(
  runId: string | null,
  onUpdate: (data: AgentEventUpdate) => void
) {
  const router = useRouter();

  useEffect(() => {
    if (!runId) return;

    const eventSource = new EventSource(`/api/logs?runId=${runId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onUpdate(data);
      } catch (error) {
        console.error('Failed to parse agent event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Agent event source error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [runId, onUpdate]);
}
