Last Updated: 2025-08-06

# 🧠 EdgePicks

EdgePicks is an AI-powered research assistant for Pick’em players, analysts, and fans. It combines modular agent logic and transparent reasoning to surface smart, explainable picks across matchups—whether you're tracking football, basketball, baseball, or beyond.

Quick links: [codex-prompts/](codex-prompts) • [llms.txt](llms.txt)

---

## 🚀 Beta Launch

```sh
git clone https://github.com/edgepicks/EdgePicks.git
cd EdgePicks
cp .env.local.example .env.local
npm install
npm run dev
```

### Architecture Diagram

![System Diagram](docs/system-diagram.png)

> 🔁 This diagram is auto-synced on every PR via CI. Changes are tracked in `llms.txt`.

---

## 🧾 System Changelog: llms.txt

All Codex-driven changes, prompt pushes, and architecture modifications are documented in [`llms.txt`](llms.txt).  
This file serves as the **Codex constitution** and **single source of truth** for:

- What each agent does
- Why a prompt was executed
- What changed (code, logic, UI)
- When it was tested and deployed

**All future agents and developers must reference `llms.txt` before executing changes.**  
The README reflects system-level intent. The `llms.txt` file reflects execution history, behavior shifts, and rationale.

## 📘 AI/ML Constitution

See [AIML_OVERVIEW.md](AIML_OVERVIEW.md) for the constitutional AI/ML architecture and governance.

## Git Hooks

This project uses [Husky](https://typicode.github.io/husky) to manage Git hooks. A pre-push hook runs `npm run postpush`, which executes `scripts/log-llms-entry.ts` and appends the latest commit details to `llms.txt`.

---

## Features

- Live predictions panel
- Transparency dashboards
- Accuracy leaderboards
- Upcoming games sourced from TheSportsDB with betting odds from OddsAPI

## Project Purpose

EdgePicks helps users make informed predictions by aggregating insights from lightweight, explainable agents. Each agent contributes a score and rationale, allowing users to understand not just what to pick—but why.

## Agent Architecture

Agents live in `lib/agents/` and return an `AgentResult` describing:

- the favored team
- a confidence score
- the reasoning behind the pick

Current agents include:

- `injuryScout` – scans injury data for potential advantages  
- `lineWatcher` – monitors line movement for sharp betting behavior  
- `statCruncher` – evaluates team performance and efficiency  
- `trendsAgent` – analyzes historical and momentum trends  
- `guardianAgent` – raises warnings on risky or inconsistent picks  

`pickBot` – orchestrator that aggregates all agent scores into a final recommendation.

See [`AGENTS.md`](AGENTS.md) for detailed agent metadata.  
Prompt formats and guidelines are documented in [`agent-prompts.md`](agent-prompts.md).  
Corresponding prompt templates reside in `lib/prompts/`.

## Project Structure

- `lib/` – core agent logic, flow helpers, and utilities
- `components/` – reusable UI elements
- `pages/api/` – Next.js API routes
- `supabase/` – database schema and seed helpers

## Live Data Sources

Upcoming NFL matchups are fetched from [TheSportsDB](https://www.thesportsdb.com/) and enriched with betting odds from [OddsAPI](https://the-odds-api.com/). The `/api/upcoming-games` endpoint exposes the top five games with team logos, kickoff times, and market lines.

## Available API Routes

- `GET /api/upcoming-games` – list upcoming matchups (supports `?league=NFL`).
- `POST /api/run-predictions` – run agent predictions for provided games.
 
### Sample Agent Output

```json
{
  "gameId": "1234",
  "finalConfidence": 0.86,
  "agents": {
    "injuryScout": { "score": 0.72, "reason": "Key WR out" },
    "lineWatcher": { "score": 0.65, "reason": "Line moved -2.5" }
  }
}
```

## Authentication

EdgePicks uses [NextAuth](https://next-auth.js.org/) with Google OAuth. Users sign in with a Google account to run predictions and access protected routes.

## Logging

Predictions append entries to `llms.txt` using:

```
[timestamp] [league] predictions run by [username]
```

## run-agents Endpoint

Run all agents for a matchup via:

```
GET /api/run-agents?teamA=<team>&teamB=<team>&matchDay=<number>
```

Returns:

- Per-agent results (team, score, reason)
- Overall winner and confidence
- Logs the outcome to Supabase (if configured)

Example stream snippet:

```text
data: {"type":"agent","name":"injuryScout","result":{"team":"KC","score":0.72,"reason":"Mahomes cleared"}}
data: {"type":"summary","matchup":{"homeTeam":"KC","awayTeam":"DEN","matchDay":1,"time":"","league":""},"agents":{"injuryScout":{"team":"KC","score":0.72,"reason":"Mahomes cleared"}},"pick":{"winner":"KC","confidence":0.72,"topReasons":["Mahomes cleared"]}}
```

### Log Status Endpoint

Monitor the in-memory log queue via:
```
GET /api/log-status
```

This returns the number of pending log entries and the last error encountered (if any).

## Flow Configurations

Flow presets live in the `flows/` directory as simple JSON files that list which agents should run for a request. Each config includes a human-friendly name and an ordered array of agent IDs:

```json
{
  "name": "Default NFL Flow",
  "agents": ["injuryScout", "statCruncher", "lineWatcher", "guardianAgent"]
}
```

Streaming endpoints accept a `flow` query parameter so you can select one of these configs. If omitted, `/api/run-agents` defaults to `football-pick` and `/api/trends` defaults to `trends`.

### SSE Examples

Use `curl` with `-N` to watch Server-Sent Events as they arrive:

```sh
curl -N -H "Accept: text/event-stream" "http://localhost:3000/api/run-agents?teamA=KC&teamB=DEN&matchDay=1&flow=football-pick"
curl -N -H "Accept: text/event-stream" "http://localhost:3000/api/trends?flow=trends"
```

## Environment Variables

Create a `.env.local` file in the project root for local development. The app
falls back to `.env` if `.env.local` is absent. Start by copying the example:

```sh
cp .env.local.example .env.local
```

Then add your own keys:

```env
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<secure-generated-secret>
ODDS_API_KEY=<your-oddsapi-key>
SPORTS_API_KEY=<your-thesportsdb-api-key>
SPORTS_DB_NFL_ID=<thesportsdb-nfl-league-id>
SPORTS_DB_MLB_ID=<thesportsdb-mlb-league-id>
SPORTS_DB_NBA_ID=<thesportsdb-nba-league-id>
SPORTS_DB_NHL_ID=<thesportsdb-nhl-league-id>
```

Common TheSportsDB league IDs:

- NFL: `4391`
- MLB: `4424`
- NBA: `4387`
- NHL: `4380`

Use `.env.local` for local development and `.env.production` for deployments. Both files share the same keys, but missing values in production will cause the app to throw at startup to avoid silent failures. Run `npm run validate-env` to verify example files contain required variables. During `npm run dev`, a `missing-env-report.txt` file lists any required keys that are unset in your current environment.

You can find the Supabase values in your dashboard under **Project Settings → API**.
The NextAuth variables enable Google sign-in for protected routes.
`SPORTS_API_KEY` is required for live schedule fetching from TheSportsDB.
`SPORTS_DB_NFL_ID` sets the TheSportsDB league ID for NFL (default `4391`). Use `SPORTS_DB_MLB_ID`, `SPORTS_DB_NBA_ID`, and `SPORTS_DB_NHL_ID` to configure other leagues. These values populate the `SPORTS_DB_LEAGUE_IDS` map in `lib/data/liveSports.ts`.

### Development Setup

```sh
npm install
npm run dev:local    # starts dev server at http://localhost:3000
```

### Testing

Run the default test suite with the pre-commit command:

```sh
npm test
```

For local development runs:

```sh
npm run test:local
```

### Local API Tests
With the server running you can verify key routes:

```sh
curl -I http://localhost:3000/auth/signin
curl -X GET "http://localhost:3000/api/upcoming-games?league=NFL"
curl -X POST http://localhost:3000/api/run-agents
```

### Flow Execution
```
matchup → agents → logToSupabase → accuracy updates
```

### Database Schema Notes
actual_winner – actual outcome recorded post-game

is_auto_pick – whether a selection was auto-generated

extras – JSON field for additional metadata

### Updating Actual Results
After games conclude, record the real-world outcome so the leaderboard can track accuracy.
Update the `actual_winner` column in Supabase through the Table Editor or by running a query:

```
UPDATE matchups SET actual_winner = 'BOS' WHERE id = '<matchup-id>';
```
Rows without an outcome show "N/A" in the history page and are ignored in accuracy calculations.

🧱 Adding New Agents or Data Sources
Create a new file in lib/agents/ exporting an AgentResult based on a Matchup.

Register the agent in:

lib/agents/pickBot.ts

pages/api/run-agents.ts

If needed, add data access via lib/supabaseClient.ts or new APIs.
Document the agent in codex-prompts/ (optional).
Test with npm run dev or curl to ensure end-to-end functionality.

📈 Built-in Features
✅ Responsive UI with confidence bars, reasoning summaries, and dark mode
📊 Leaderboard to track agent performance over time
🧠 Glossary to explain how agents work
🗂 History page showing past evaluations
🔬 Debug panel for raw/weighted score breakdowns

📄 License
MIT
