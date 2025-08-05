# 🧠 EdgePicks

**EdgePicks** is an AI-powered research assistant for Pick’em players, analysts, and fans. It combines modular agent logic and transparent reasoning to surface smart, explainable picks across matchups—whether you're tracking football, basketball, baseball, or beyond.

## 🏆 Project Purpose

EdgePicks helps users make informed predictions by aggregating insights from lightweight, explainable agents. Each agent contributes a score and rationale, allowing users to understand not just what to pick—but *why*.

Built for extensibility and clarity, EdgePicks supports:
- Weekly matchup analysis
- Per-agent insight comparison
- Data logging and performance tracking
- Multi-sport flexibility

---

## ⚙️ Agent Architecture

Agents live in `lib/agents/` and return an `AgentResult` describing:
- the **favored team**
- a **confidence score**
- the **reasoning** behind the pick

Current agents include:

- `injuryScout` – scans injury data for potential advantages
- `lineWatcher` – monitors line movement for sharp betting behavior
- `statCruncher` – evaluates team performance and efficiency
- `pickBot` – orchestrator that aggregates all agent scores into a final recommendation

---

## 📡 API Endpoint

Run all agents for a matchup via:

GET /api/run-agents?teamA=<team>&teamB=<team>&matchDay=<number>

yaml
Copy
Edit

Returns:
- Per-agent results (`team`, `score`, `reason`)
- Overall winner and confidence
- Logs the outcome to Supabase (if configured)

---

## 🌐 Environment Variables

To enable Supabase integration, create a `.env` file in the project root:

```bash
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-anon-key>
```

You can find these values in your Supabase dashboard under **Project Settings → API**. They are required by `lib/supabaseClient.ts` to connect to your Supabase project.

## 🧪 Example Commands

```bash
npm install             # install dependencies
npm run dev             # start dev server (localhost:3000)

curl "http://localhost:3000/api/run-agents?teamA=BOS&teamB=LAL&matchDay=1" # sample multi-sport matchup request
```

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
