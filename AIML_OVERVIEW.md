# 🧠 AIML_OVERVIEW.md – EdgePicks AI/ML Constitution
_Last Updated: August 6, 2025_

## 🔍 Purpose

This file serves as the source of truth for all AI/ML logic in EdgePicks, including:

- Agent design and responsibilities
- Flow orchestration patterns
- Feature-to-agent mappings
- Environment requirements for AI inference
- Governance protocol for safe, explainable ML

---

## 🤖 Agents

Each AI agent contributes domain-specific insights to NFL matchup predictions. Current agents:

- `InjuryScout`: Scrapes injury reports, flags absences and return-to-play indicators
- `LineWatcher`: Monitors betting lines for sharp movement or reverse trends
- `StatCruncher`: Computes stats like yards per play, QB pressure rate, turnover margin
- `CoachWhisperer`: Applies heuristics on coaching style, decisions, and aggression
- `WeatherEye`: Flags games with precipitation, heat index, or wind speed anomalies

All agents output structured JSON to the `AgentDebugPanel` and propagate to `MatchupInsightsPanel`.

---

## 🔁 Flow Orchestration

- `FlowOrchestrator` manages agent invocation in sequence or parallel, with optional weighting logic.
- User input via `MatchupInputForm` triggers flows like `defaultNFLFlow`, which load all agents.
- Agent outputs are merged into a composite prediction result, rendered in the UI with transparency.

---

## 🧪 ML & Heuristics

While no deep learning models are currently deployed, agents use ML-adjacent logic:

- Rule-based scoring (StatCruncher, CoachWhisperer)
- Real-time signals and weighting (LineWatcher)
- Environmental heuristics (WeatherEye)
- Future expansion may include:
  - GNNs for player interaction modeling
  - LLM-based playbook similarity
  - Reinforcement learning for betting scenarios

All logic must remain explainable, sandboxed, and inspectable.

---

## 🛡️ Environment

Agents rely on:
- `SUPABASE_URL`, `SUPABASE_KEY` – for logs, auth, user context
- `SPORTSDATAIO_API_KEY`, `GOOGLE_CLIENT_ID` – for sports data + auth
- `.env.local` – only used during local development
- `lib/env.ts` – exports a centralized `ENV` object and throws on missing keys
- `scripts/validateEnv.ts` – build-time enforcement

---

## Governance

This document is **constitutional**. All future Codex prompts involving agents, flows, prediction methods, or model changes must:

- Reference `AIML_OVERVIEW.md`
- Append any change to `## Amendments` below with a rationale and signature
- Log entries in `llms.txt` as `[codex] Amend AIML_OVERVIEW.md: ...`
- Tag PRs with `docs: amend AIML_OVERVIEW.md [codex-governance]`

Changes without documented amendment may be rejected.

---

## 🧾 Amendments

> None yet. You will be the first. 🤝

---

## 📌 Location

- Path: `/AIML_OVERVIEW.md`
- Linked from: `README.md → 📘 AI/ML Constitution`

---

## 🧠 Author(s)

Created by the Codex system and Csp-Ai on August 6, 2025. All contributors must leave signatures under each amendment.

✅ Testing Instructions
```bash
npm run validate-env   # Confirms ENV logic works
npm test               # Full suite (ensure no breakage)
npx vercel --prod      # Will fail if GOOGLE_CLIENT_ID is not set
```
