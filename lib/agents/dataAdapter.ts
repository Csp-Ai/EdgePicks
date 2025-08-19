export type AgentEvent = { type: 'node' | 'edge' | 'meta'; payload: any; ts: number };

export type Adapter = {
  stream(opts: { league?: string; demo?: boolean; signal?: AbortSignal }): AsyncIterable<AgentEvent>;
  snapshot(opts: { league?: string; demo?: boolean }): Promise<{ nodes: any[]; edges: any[] }>;
};

// Live adapter using EventSource for streaming
export const liveAdapter: Adapter = {
  async *stream({ league, signal } = {}) {
    const params = new URLSearchParams();
    if (league) params.set('league', league);
    const es = new EventSource(`/api/run-agents?${params.toString()}`);
    const queue: AgentEvent[] = [];
    let resolver: ((value: IteratorResult<AgentEvent>) => void) | null = null;

    const push = (ev: AgentEvent) => {
      if (resolver) {
        resolver({ value: ev, done: false });
        resolver = null;
      } else {
        queue.push(ev);
      }
    };

    es.onmessage = (e) => {
      try {
        const ev = JSON.parse(e.data) as AgentEvent;
        push(ev);
      } catch {
        // ignore malformed events
      }
    };

    const close = () => {
      es.close();
      if (resolver) {
        resolver({ value: undefined as any, done: true });
      }
    };

    es.onerror = close;
    if (signal) signal.addEventListener('abort', close);

    try {
      while (true) {
        if (queue.length) {
          yield queue.shift()!;
        } else {
          const next: IteratorResult<AgentEvent> = await new Promise((res) => (resolver = res));
          if (next.done) break;
          yield next.value;
        }
      }
    } finally {
      es.close();
    }
  },
  async snapshot({ league } = {}) {
    const params = new URLSearchParams();
    if (league) params.set('league', league);
    const res = await fetch(`/api/logs?${params.toString()}`);
    if (!res.ok) throw new Error('snapshot failed');
    return res.json();
  },
};

// Demo adapter that replays a cached graph
import { demoGraph } from './demoGraph';

export const demoAdapter: Adapter = {
  async *stream() {
    for (const n of demoGraph.nodes) {
      yield { type: 'node', payload: n, ts: Date.now() };
    }
    for (const e of demoGraph.links) {
      yield { type: 'edge', payload: e, ts: Date.now() };
    }
  },
  async snapshot() {
    return { nodes: demoGraph.nodes, edges: demoGraph.links } as any;
  },
};

