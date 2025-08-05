# EdgePicks

AI-powered research assistant for NFL Pick'em that combines multiple lightweight agents to surface weekly matchup edges.

## Getting Started

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and provide Supabase credentials
3. Run the development server: `npm run dev`

## Project Structure

- `pages/` – Next.js pages. `index.tsx` lists matchups using mock data.
- `components/` – Reusable UI pieces like `MatchupCard` and `AgentSummary`.
- `lib/agents/` – Modular TypeScript agents such as `injuryScout`, `lineWatcher`, and `statCruncher` plus the orchestrator `pickBot`.
- `lib/mock/agentOutput.ts` – Static JSON used for demos.
- `codex-prompts/` – Prompt files describing each agent's role.

## License

MIT
