# 🧠 AIML_OVERVIEW.md – EdgePicks AI/ML Constitution
_Last Updated: August 7, 2025_

## 🔍 Purpose

This file serves as the source of truth for all AI/ML logic in EdgePicks, including:

- Agent design and responsibilities
- Flow orchestration patterns
- Feature-to-agent mappings
- Environment requirements for AI inference
- Governance protocol for safe, explainable ML

---

## 🤖 Agents

Each AI agent contributes domain-specific insights to NFL matchup predictions. Active agents are detailed in `agents.ms` and include:

- `injuryScout` – tracks player injuries and availability
- `lineWatcher` – monitors betting line movement and market signals
- `statCruncher` – crunches historical statistics for trends
- `trendsAgent` – analyzes recent matchups for flow popularity and hit rates
- `guardianAgent` – reviews outputs for inconsistent or incomplete reasoning

All agents output structured JSON and stream reasoning to the UI and logs.

---

## 🔁 Flow Orchestration

- `FlowOrchestrator` runs compatible agents in parallel batches followed by guardian audits.
- User input triggers `defaultNFL` which invokes `injuryScout`, `lineWatcher`, and `statCruncher` concurrently.
- `guardianAgent` validates the batch and can surface improvement suggestions.
- Reflections recorded in `logs/agent-reflections.json` feed a self-regenerative loop for future runs.

---

## 🧪 ML & Heuristics

While no deep learning models are currently deployed, agents use ML-adjacent logic:

- Rule-based scoring (`statCruncher`)
- Real-time signals and weighting (`lineWatcher`)
- Contextual heuristics (`injuryScout`, `trendsAgent`)
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
