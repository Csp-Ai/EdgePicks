# EdgePicks

AI-powered research assistant for NFL Pick'em that combines multiple lightweight agents to surface weekly matchup edges.

## Project Purpose

EdgePicks aggregates insights from modular agents so pick'em players can quickly identify advantageous matchups and understand the reasoning behind each recommendation.

## Agent Architecture

Agents live in `lib/agents/` and each returns an `AgentResult` describing a favored team, score, and justification.

- `injuryScout` – checks injury reports.
- `lineWatcher` – monitors betting line movement.
- `statCruncher` – looks at efficiency stats.
- `pickBot` – orchestrator that combines agent scores to produce a final pick.

## API Endpoints

- `GET /api/run-agents?teamA=<team>&teamB=<team>&week=<number>` runs all agents for the supplied matchup and returns individual results plus an overall pick summary.

## Environment Variables

Copy `.env.example` to `.env` and provide:

```bash
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-anon-key>
```

These values are used by `lib/supabaseClient.ts` to connect to Supabase.

## Example Commands

```bash
npm install            # install dependencies
npm run dev            # start Next.js development server
curl "http://localhost:3000/api/run-agents?teamA=NE&teamB=NYJ&week=1"  # sample API call
```

## Adding New Agents or Data Sources

1. Create a new file in `lib/agents/` that exports an `AgentResult` for a `Matchup`.
2. Import the agent in `lib/agents/pickBot.ts` and `pages/api/run-agents.ts` and adjust the weights.
3. If the agent relies on external data, configure access (e.g., update `lib/supabaseClient.ts` or add new fetch logic) and document any required env vars.
4. Optionally add a prompt file in `codex-prompts/` to describe the agent's role.
5. Run the example commands above to ensure the new agent works end-to-end.

## License

MIT
