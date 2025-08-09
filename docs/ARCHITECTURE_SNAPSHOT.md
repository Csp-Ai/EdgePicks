# Architecture Snapshot

EdgePicks combines a Next.js front end with modular agents that score sports matchups.

## Domains
- **Frontend**: Next.js pages in `pages/` with shared components under `components/`.
- **Agent Layer**: TypeScript agents in `agents/` orchestrated by flows in `flows/`.
- **Data**: Supabase persists results while `agentLogsStore.json` captures temporary logs.

## Flows
- `flows/` defines execution paths and scoring aggregation for agents.
- Flows can dynamically include or exclude agents based on matchup context.

## Agents
- Core agents: `injuryScout`, `lineWatcher`, `statCruncher`, `trendsAgent`, and `guardianAgent`.
- Prompt templates reside in `lib/prompts/`.

## CI/CD
- GitHub Actions handle tests, linting, accessibility, and repo-quality checks.
- Deployments are triggered on merges to `main` via the hosting provider.

For deeper architectural details see `docs/prediction-flow-architecture.md` and related documents.
