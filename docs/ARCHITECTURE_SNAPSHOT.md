# Architecture Snapshot

EdgePicks combines a Next.js frontend with modular agents to evaluate sports matchups.

## Frontend
- Built with Next.js; pages live in `pages/`.
- UI components are stored under `components/`.

## Agent Layer
- Individual agents reside in `agents/` (e.g., `injuryScout`, `lineWatcher`, `statCruncher`).
- Prompt templates live in `lib/prompts/`.
- `flows/` orchestrates agent execution and scoring.

## Data and Storage
- Supabase provides persistent storage.
- Temporary agent logs are captured in `agentLogsStore.json` for later syncing.

## Testing
- Run `npm test` to execute the Jest test suite.

For deeper architectural details see `docs/prediction-flow-architecture.md` and related documents in the `docs/` directory.
