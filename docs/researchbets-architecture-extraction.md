# ResearchBets Architectural & Product Extraction

## 1) PRODUCT VISION LAYER

```json
{
  "thesis": "Use a modular multi-agent system to generate sports picks that are transparent, auditable, and trust-forward rather than black-box predictions.",
  "target_user": "A sports bettor or analyst who wants machine-assisted picks with explicit reasoning, confidence, and visible agent accountability.",
  "differentiation": "Agent-level modularity (weighted specialists + guardian/analytics agents), lifecycle instrumentation, and trust UX primitives (agreement/variance, confidence breakdowns, explainers, provenance tags).",
  "transferable_product_principles": [
    "Separate specialist inference agents from quality-control/meta agents.",
    "Return strict structured JSON from every agent to keep outputs machine-composable.",
    "Expose confidence plus contribution breakdowns at render time, not only in logs.",
    "Treat transparency as a first-class product surface (trust hubs, explainers, logs).",
    "Support dynamic weighting and snapshot-based calibration from historical outcomes."
  ]
}
```

## 2) FRONTEND ARCHITECTURE PATTERNS

```json
{
  "layout_patterns": [
    "Multi-pane terminal-like layout exists in `UnifiedDemoLayout` with left sport selector, center tabs/content, and right prediction sidebar.",
    "Route-group split between marketing and product surfaces with dynamic rendering for live-data product pages.",
    "Dashboard card-grid composition and tabbed trust surfaces are used across product and trust views."
  ],
  "reusable_components": [
    "`components/layouts/UnifiedDemoLayout.tsx` as a shell baseline for a research terminal frame.",
    "`components/MatchupCard.tsx` (confidence meter, contribution bars, disagreement badges, explainability toggles).",
    "`components/agents/*` primitives such as `ReasoningDisclosure`, `AgentTrustScore`, `TransparencyDrawer`.",
    "`components/ui/*` CVA/Tailwind primitives (`button`, `card`, `tabs`, `sheet`, `Table`, `skeleton`)."
  ],
  "trust_patterns": [
    "Confidence decomposition tooltip and per-agent weighted contribution math is visible in the UI.",
    "Agreement score derived from inter-agent variance is surfaced.",
    "Provenance chip communicates mode (live/demo) and freshness (cached/fresh + age).",
    "Dedicated Trust page tabs (overview/audit/agents) package transparency as a product module."
  ],
  "interaction_patterns": [
    "SWR is the dominant client-fetch model with retry and revalidate-on-focus behavior.",
    "Polling-based run status updates every 3 seconds in flow animation components.",
    "Suspense + ErrorBoundary wrappers appear around major demo panels.",
    "Tailwind utility transitions and a small animation token layer (`FADE_DURATION`, shimmer) provide low-friction motion."
  ],
  "weaknesses": [
    "State is distributed across local component state, SWR, and ad-hoc hooks without a single app-level query/event model.",
    "Loading/empty/error states are inconsistent (from simple text placeholders to custom spinners/skeletons).",
    "Design token sources are split across CSS variables, Tailwind extension, and component-level classes.",
    "Some trust components are polished conceptually but still visually lightweight vs terminal-grade density and hierarchy."
  ]
}
```

## 3) AGENT / BACKEND TRANSPARENCY PATTERNS

```json
{
  "telemetry_model": "Dual-path telemetry: generic zod event schema + sink abstraction with console in non-prod and Supabase telemetry table in production; additional server log path persists `kind/payload/request_id/user_id/ts` with retries.",
  "agent_surface_pattern": "Agent metadata registry (`agents.json`) + dynamic runner loading (`loadAgents`) + flow orchestrator (`runFlow`) that emits lifecycle callbacks (`started/completed/errored`) and execution artifacts (`result/errorInfo/duration`).",
  "explainability_pattern": "Agent outputs carry reason/reasoning and warnings; frontend exposes disclosure drawers, confidence breakdown tooltips, and trust/audit panels; guardian agent checks for missing reasoning and contradictory confidence signals.",
  "confidence_model": "Weighted aggregation across specialist agents (`pickBot` + registry weights), with optional Bayesian-smoothed dynamic reweighting from `agent_stats`/`agent_weights_snapshot` and UI-level agreement derived from score variance.",
  "observability_strengths": [
    "Lifecycle event model includes timestamps and durations suitable for timeline/graph visualizations.",
    "SSE log stream endpoint subscribes to realtime agent run updates in Supabase.",
    "File-backed fallback agent log store protects run data when upstream sync fails.",
    "Prediction response schemas and runtime zod guards establish contract boundaries for downstream consumers."
  ]
}
```

## 4) UX GAPS / DESIGN DEBT

```json
{
  "architectural_mismatch": [
    "Backend narratives/documentation reference richer SSE/session tracing than currently exposed by active app-router run endpoints.",
    "`run-predictions` is explicitly stubbed while surrounding product language implies full live orchestration.",
    "Frontend logs modal queries `sessionId/agentId`, while the app-router logs endpoint currently requires `runId`, indicating surface contract drift."
  ],
  "UX_gaps": [
    "Agent run progress is mostly polling-based and coarse (binary progress bar) instead of granular per-stage throughput/latency traces.",
    "No consolidated terminal table for cross-game query, filtering, sorting, and drill-down comparable to quant workstations.",
    "Trust artifacts are present but fragmented across pages/components instead of a single persistent analysis pane.",
    "Sparse visual encoding for confidence distributions, uncertainty intervals, and market microstructure context."
  ],
  "quick_wins": [
    "Normalize run/session identifiers across APIs and UI (single canonical `run_id` + optional `session_id`).",
    "Replace polling run progress with streamed lifecycle events and granular step timings.",
    "Standardize async states via shared primitives (`Empty`, `skeleton`, error callouts) and enforce usage with lint/component contracts.",
    "Elevate existing trust components into a persistent right-rail inspector shared across product routes."
  ]
}
```

## 5) DIRECT CODE REUSE CANDIDATES

```json
{
  "high_value_files": [
    "lib/flow/runFlow.ts",
    "lib/agents/loadAgents.ts",
    "lib/agents/registry.ts",
    "lib/weights/index.ts",
    "lib/schemas/predictions.ts",
    "lib/dashboard/useFlowVisualizer.ts",
    "app/api/logs/route.ts",
    "components/MatchupCard.tsx",
    "components/agents/ReasoningDisclosure.tsx",
    "components/predictions/ProvenanceTag.tsx"
  ],
  "refactor_candidates": [
    "app/api/run-predictions/route.ts (upgrade from stub to orchestrator entrypoint).",
    "app/api/run-agents/route.ts (currently start/poll pattern; align with lifecycle streaming + richer output contracts).",
    "components/AgentLogsModal.tsx + app/api/logs/route.ts (identifier/query contract mismatch).",
    "docs/prediction-flow-architecture.md (bring docs in sync with app-router implementation)."
  ],
  "shared_primitives": [
    "Agent confidence + contribution bars from `components/MatchupCard.tsx` and related meter/badge components.",
    "`components/ui/*` primitives (`button`, `tabs`, `card`, `Table`, `skeleton`) as seed design system.",
    "Trust rail components (`TransparencyDrawer`, `AgentTrustScore`, `ReasoningDisclosure`) for reusable explainability surfaces.",
    "Telemetry/log sink abstraction in `lib/telemetry/logger.ts` and `lib/server/logEvent.ts`."
  ]
}
```

## 6) STRATEGIC INSIGHTS

```json
{
  "terminal_upgrades": [
    "Introduce a persistent multi-panel workstation shell (watchlist, query grid, model inspector, event tape) across product routes.",
    "Adopt a unified data query layer (TanStack Query + websocket/SSE event bus) with cache keys aligned to entity/timeframe/market.",
    "Promote lifecycle graph into a full execution trace viewer with step timings, retries, and error lineage.",
    "Add keyboard-first workflows (global command palette, panel focus shortcuts, saved views/layout presets)."
  ],
  "data_surface_upgrades": [
    "Build dense, sortable tables for games, lines, injuries, model deltas, and historical agent hit rates.",
    "Expose uncertainty statistics (intervals, calibration curves, drift metrics) beside point confidence.",
    "Add time-series comparison panes for line movement vs model confidence vs realized outcomes.",
    "Implement provenance overlays linking each pick to source snapshots, timestamp, and transformation path."
  ],
  "authority_signals_missing": [
    "No unified run ledger with immutable run IDs, checksums, and reproducibility metadata visible to the end user.",
    "Limited institutional-grade audit UX (who changed weights, when, why, and downstream impact).",
    "Insufficient model governance surfaces (versioned prompt diffs, validation status, backtest windows, confidence calibration health).",
    "Lack of explicit market microstructure context (liquidity, limits, consensus dispersion, stale-feed warnings)."
  ]
}
```
