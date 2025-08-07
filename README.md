🧠 EdgePicks

EdgePicks is a modular, explainable AI research assistant for Pick'em players, sports analysts, and data-driven fans. It aggregates insights from lightweight agents to generate confident, transparent recommendations for NFL matchups and beyond.

Last Updated: 2025-08-07

Quick access:

Codex Prompts

Agent History (llms.txt)

AI Constitution

🚀 Local Setup

git clone https://github.com/edgepicks/EdgePicks.git
cd EdgePicks
cp .env.local.example .env.local
npm install
npm run dev

Verify environment variables:

npm run validate-env

### Live vs Mock

EdgePicks can run entirely from local mocks to avoid external API calls. Set `LIVE_MODE=off` to use bundled fixtures and skip network requests. When `LIVE_MODE=on`, the app fetches live data.

🧱 Architecture Overview



This diagram auto-updates on every PR. System history is logged in llms.txt.

Frontend: Next.js 14 (React, TypeScript, TailwindCSS)

Backend: API routes, modular agent flows

Database: Supabase (RLS-secured)

Auth: NextAuth + Google OAuth

Hosting: Vercel (CI/CD integrated)

Key modules:

lib/agents/: All predictive agents (e.g. injuryScout, lineWatcher)

flows/: JSON-defined agent sequences

scripts/: Logging + dev tools

pages/api/: API endpoints for predictions, trends, auth, and logging

🧠 Core Agents

Each agent analyzes a different dimension of a matchup. All return a standardized AgentResult:

interface AgentResult {
  team: string;
  score: number;
  reason: string;
}

Current agents:

injuryScout: Flags injuries or roster disruptions

lineWatcher: Tracks betting line movements

statCruncher: Analyzes team efficiency and performance

trendsAgent: Identifies win/loss streaks and momentum

guardianAgent: Flags data anomalies or risky picks

Aggregator:

pickBot: Orchestrates agents into a final weighted recommendation

📊 Key Features

✅ Live prediction panel

📈 Agent reasoning transparency

🧪 Accuracy leaderboard

📅 NFL schedule viewer

🌘 Dark mode

♿ Accessible UI with keyboard navigation

🔐 Authentication

Google OAuth via NextAuth secures:

/dashboard

/predictions

Any POST route

Rate limiting and RLS (Row-Level Security) enforced on sensitive endpoints.

📥 API Quick Reference

Method

Route

Purpose

GET

/api/upcoming-games?league=NFL

Fetch games

POST

/api/run-agents

Run selected agents

POST

/api/run-predictions

Run entire flow

GET

/api/log-status

View logging queue

GET

/api/accuracy

Pull leaderboard data

Sample run-agents Output

{
  "finalConfidence": 0.82,
  "pick": "KC",
  "agents": {
    "injuryScout": { "score": 0.76, "reason": "Mahomes cleared" },
    "lineWatcher": { "score": 0.68, "reason": "Line shifted -3.5" }
  }
}

📋 Environment Variables

.env.local or .env.production must include:

SUPABASE_URL=...
SUPABASE_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
ODDS_API_KEY=...
SPORTS_API_KEY=...
SPORTS_DB_NFL_ID=4391

Run npm run validate-env to check missing vars. See .env.local.example for a complete list.

🔍 Testing

Unit tests:

npm test

Local test environment:

npm run test:local

🧾 System Logs (llms.txt)

Codex events, system changes, and prompt pushes are logged in llms.txt. This includes:

When agents are created or updated

Why a prompt was triggered

Who made the change

Which files were modified

Developers must reference llms.txt before modifying core flows or logic.

🧪 Accuracy Tracking

After games conclude, update the actual_winner column via Supabase UI or SQL:

UPDATE matchups SET actual_winner = 'NE' WHERE id = '<matchup_id>';

Leaderboards will recalculate based on agent accuracy.

📦 Agent Contribution Guide

Create a new file in lib/agents/

Export a default function returning an AgentResult

Add metadata to AGENTS.md

Register agent in pickBot.ts and run-agents.ts

Document prompt (optional) in codex-prompts/

Use the upcoming CLI tool (create-agent) for scaffolding.

🧠 Codex-Driven Development

All architectural changes must be justified in a prompt.

Codex agents analyze flows weekly via audit-agent.ts

PRs are gated by CI + required review

Example audit output:

🔴 Missing auth on /api/run-predictions

🟡 No tests for trendsAgent

🟢 Consistent agent logs ✅

📜 License

MIT. Built with ❤️ by veterans, analysts, and engineers.

EdgePicks is a research-forward, ethics-driven AI tool that prioritizes explainability, trust, and modular design. Every prediction is traceable, inspectable, and debuggable.

If you can't explain the pick, it doesn't belong in the lineup.

