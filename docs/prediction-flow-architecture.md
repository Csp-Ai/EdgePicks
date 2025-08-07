# Prediction Flow Architecture

### Matchup Submission via `MatchupInputForm.tsx`
File: [components/MatchupInputForm.tsx](../components/MatchupInputForm.tsx)
- Inputs: `homeTeam`, `awayTeam`, `week`
- On submit: initializes `EventSource` stream to `/api/run-agents`
- Persists `sessionId` and user metadata
- Accessibility note: spacing between input fields and error highlights comply with WCAG 2.1
```tsx
const evtSource = new EventSource(`/api/run-agents?...`);
```

### SSE API Handler: `/api/run-agents.ts`
File: [pages/api/run-agents.ts](../pages/api/run-agents.ts)
- Validates query params
- Uses `runFlow.ts` to orchestrate agents
- Streams JSON events via `res.write()` (SSE):
  - `started`, `completed`, `errored`, `log`
- Tags each chunk with: `sessionId`, `agentId`, `timestamp`, and `duration`
- Failed Supabase syncs are preserved in `agentLogsStore.json` for post-run fallback via docsync-agent.

### Flow Orchestration: `runFlow.ts` + `flowRegistry.ts`
Files: [lib/flow/runFlow.ts](../lib/flow/runFlow.ts), [flows/](../flows)
- Dynamically loads agent list based on flow type (e.g., `defaultNFL`)
- Runs agents in order, optionally in parallel
- Pipes output and logs to Supabase
- Pushes real-time results to EventSource stream
- Fallback error flows activate on uncaught exceptions

```
MatchupInputForm → /api/run-agents → runFlow.ts → agent.run() → Supabase + Stream → UI
```

### UI Updates + Agent Lifecycle
- [`AgentNodeGraph.tsx`](../components/AgentNodeGraph.tsx):
  - Animates each agent node
  - Errors highlighted in red
  - Dims inactive agents
- [`AgentStatusPanel.tsx`](../components/AgentStatusPanel.tsx):
  - Lists current agent state (`running`, `errored`, `done`)
  - Supports "Re-run Agent" for failed nodes
- [`AgentLeaderboardPanel.tsx`](../components/AgentLeaderboardPanel.tsx):
  - Ranks agents by score and confidence
  - Scoped by `sessionId`
- [`AgentLogsModal.tsx`](../components/AgentLogsModal.tsx):
  - Loads session logs via `/api/logs`
  - Supports tabs: Raw Output, Errors, Confidence

### Logging + Unsynced Sessions
Files: [lib/agentLogsStore.ts](../lib/agentLogsStore.ts), [agentLogsStore.json](../agentLogsStore.json)
- Logs written via `logAgentOutput(agent, sessionId, data)`
- Stored in `agentLogsStore.json`
- Unsynced logs tagged with `"synced": false`
- `docsync-agent.ts` attempts to push to GitHub Wiki and Supabase:
  - If Supabase fails, fallback issues logged
- Accessibility issues (like component spacing) logged in `.github/ui-components-review.md`

### Error Handling + Recovery
File: [pages/api/run-agents.ts](../pages/api/run-agents.ts)
- Streamed errors include stack trace + metadata
- UI reflects agent-level errors instantly
- Re-run support ensures bettors aren’t stuck
- All streamed errors stored for later review even if Supabase fails
```ts
res.write(JSON.stringify({
  status: 'errored',
  agentId,
  sessionId,
  message: err.message,
  stack: err.stack
}));
```

### Extensibility + Flow Expansion
Files: [lib/agents/registry.ts](../lib/agents/registry.ts), [flows/](../flows)
- New agents:
  - Add to `flowRegistry.ts`
  - Must export `run()` and `explain()` methods
  - Logs auto-integrate with Leaderboard, LogsModal, and DocSync
- New flows:
  - Create a named flow in `flowRegistry`
  - Supports conditional agent activation
