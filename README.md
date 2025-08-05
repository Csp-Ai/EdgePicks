Last Updated: 2025-08-05

# 🧠 EdgePicks

EdgePicks is an AI-powered research assistant for Pick’em players, analysts, and fans. It combines modular agent logic and transparent reasoning to surface smart, explainable picks across matchups—whether you're tracking football, basketball, baseball, or beyond.

## Features

- Live predictions panel
- Transparency dashboards
- Accuracy leaderboards

## Project Purpose

EdgePicks helps users make informed predictions by aggregating insights from lightweight, explainable agents. Each agent contributes a score and rationale, allowing users to understand not just what to pick—but why.

## Agent Architecture

Agents live in lib/agents/ and return an AgentResult describing:

the favored team

a confidence score

the reasoning behind the pick

Current agents include:

- injuryScout – scans injury data for potential advantages
- lineWatcher – monitors line movement for sharp betting behavior
- statCruncher – evaluates team performance and efficiency
- trendsAgent – analyzes historical and momentum trends
- guardianAgent – raises warnings on risky or inconsistent picks

pickBot – orchestrator that aggregates all agent scores into a final recommendation

See [AGENTS.md](AGENTS.md) for detailed agent metadata.

## Project Structure

- `lib/` – core agent logic, flow helpers, and utilities
- `components/` – reusable UI elements
- `pages/api/` – Next.js API routes
- `supabase/` – database schema and seed helpers

## API Endpoint

Run all agents for a matchup via:

GET /api/run-agents?teamA=<team>&teamB=<team>&matchDay=<number>

Returns:

Per-agent results (team, score, reason)

Overall winner and confidence

Logs the outcome to Supabase (if configured)

### Log Status Endpoint

Monitor the in-memory log queue via:

GET /api/log-status

This returns the number of pending log entries and the last error encountered (if any).

## Environment Variables

To enable Supabase integration, create a .env file in the project root:

SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-anon-key>

You can find these values in your Supabase dashboard under Project Settings → API. They are required by lib/supabaseClient.ts to connect to your Supabase project.

## Development Setup

1. `npm install`
2. Copy `.env.example` to `.env` and configure values
3. `npm run dev` (starts dev server at `localhost:3000`)

## Flow Execution

matchup → agents → `logToSupabase` → accuracy updates

## Database Schema Notes

- `actual_winner` – actual outcome recorded post-game
- `is_auto_pick` – whether a selection was auto-generated
- `extras` – JSON field for additional metadata

## Updating Actual Results

After games conclude, record the real-world outcome so the leaderboard can track accuracy. Update the `actual_winner` column in Supabase via the Table Editor or SQL:

update matchups set actual_winner = 'BOS' where id = '<matchup-id>';

Rows without an outcome show N/A in the history page and are ignored in accuracy calculations.

🧱 Adding New Agents or Data Sources

Create a new file in lib/agents/ exporting an AgentResult based on a Matchup.

Register the agent in:

lib/agents/pickBot.ts

pages/api/run-agents.ts

If needed, add data access via lib/supabaseClient.ts or new APIs.

Document the agent in codex-prompts/ (optional).

Test with npm run dev or curl command to ensure end-to-end functionality.

📈 Built-in Features

✅ Responsive UI with confidence bars, reasoning summaries, and dark mode

📊 Leaderboard to track agent performance over time

🧠 Glossary to explain how agents work

🗂 History page showing past evaluations

🔬 Debug panel for raw/weighted score breakdowns

📄 License

MIT
