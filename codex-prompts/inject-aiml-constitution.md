# Codex Prompt – Inject AI/ML Constitution & Governance Protocol

## Objective

Inject a foundational governance document (`AIML_OVERVIEW.md`) that defines the current AI/ML architecture, agent roles, flow orchestration, and amendment protocol for all future Codex-driven merges. Treat this as a living constitution for EdgePicks' modular intelligence system.

## Tasks

1. ✅ **Create `AIML_OVERVIEW.md`** in the root directory with the full content below.
2. ✅ **Link it in `README.md`**, under a new section titled `📘 AI/ML Constitution` with a markdown link.
3. ✅ **Log this in `llms.txt`** with an entry:
[codex] Injected AIML_OVERVIEW.md as AI/ML Constitution for all agent-based governance

4. ✅ **Update `codex-prompts/validateEnv-prompt.md`** to add a line under “Summary”:
> Note: This prompt interoperates with `AIML_OVERVIEW.md`, the constitutional file for agent structure and environment governance.

5. ✅ Add a `## Governance` section to `AIML_OVERVIEW.md` that defines amendment rules:
- All future Codex prompts involving agents, flows, prediction methods, or model changes must:
  - Reference `AIML_OVERVIEW.md`
  - Append to the `## Amendments` section in that file
  - Include a rationale and signature
  - Tag PRs with `docs: amend AIML_OVERVIEW.md [codex-governance]`

6. ✅ Confirm the Markdown renders correctly and commit using:
docs: add AIML_OVERVIEW.md [constitutional-injection]

---

## ✅ AIML_OVERVIEW.md (Content)

```md
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

## 🔐 Governance

This document is **constitutional**. All future Codex prompts must:

- Reference `AIML_OVERVIEW.md` directly
- Append any change to `## Amendments` below
- Log entries in `llms.txt` as `[codex] Amend AIML_OVERVIEW.md: ...`
- Commit with message:
docs: amend AIML_OVERVIEW.md [codex-governance]

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
```

🟢 Prompt complete. Standing by.
Let me know when you're ready to commit or scaffold the first amendment.
