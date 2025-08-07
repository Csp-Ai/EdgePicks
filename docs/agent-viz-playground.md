# Agent Visualization Playground

The `/viz` route renders a standalone playground that animates mock agent runs.
It does **not** hit any APIs and is safe for server-side rendering.

## Adding mock runs

1. Edit `lib/mock/agentRuns.ts` and append a new `AgentRun` fixture.
2. Import it in the exported `mockAgentRuns` map.
3. The run will automatically appear in the `/viz` selector.

## Streaming

`lib/mock/streamAgentRun.ts` provides a simple timer-based stream utility that
invokes callbacks for each event. In production this will be replaced with real
server-sent events.

## Future

The playground makes it easy for design to iterate on animations and layout
before wiring up real prediction data.
