version: 1
updated: 2025-08-07
schemas:
  matchup:
    type: object
    properties:
      homeTeam: { type: string }
      awayTeam: { type: string }
      date: { type: string }
    required: [homeTeam, awayTeam]
  agent_result:
    type: object
    properties:
      agent: { type: string }
      team: { type: string }
      score: { type: number }
      reason: { type: string }
      metadata: { type: object, nullable: true }
agents:
  - id: injuryScout
    purpose: Tracks player injuries and availability.
    input_schema: { $ref: '#/schemas/matchup' }
    output_schema: { $ref: '#/schemas/agent_result' }
    confidence:
      metric: accuracy
      window: 14d
      value: 0.50
    ethical_guardrails:
      - Use only publicly available medical reports
    self_regenerative: logs reflections after each run
  - id: lineWatcher
    purpose: Monitors betting line movement and market signals.
    input_schema: { $ref: '#/schemas/matchup' }
    output_schema: { $ref: '#/schemas/agent_result' }
    confidence:
      metric: accuracy
      window: 14d
      value: 1.00
    ethical_guardrails:
      - Avoid market manipulation or non-public data
    self_regenerative: logs reflections after each run
  - id: statCruncher
    purpose: Crunches historical statistics for trends.
    input_schema: { $ref: '#/schemas/matchup' }
    output_schema: { $ref: '#/schemas/agent_result' }
    confidence:
      metric: pending
      window: null
      value: null
    ethical_guardrails:
      - Cite sources for derived metrics
    self_regenerative: logs reflections after each run
  - id: trendsAgent
    purpose: Analyzes recent matchups for flow popularity and agent hit rates.
    input_schema: { $ref: '#/schemas/matchup' }
    output_schema: { $ref: '#/schemas/agent_result' }
    confidence:
      metric: pending
      window: null
      value: null
    ethical_guardrails:
      - Expose methodology for trend selection
    self_regenerative: logs reflections after each run
  - id: guardianAgent
    purpose: Reviews outputs for inconsistent or incomplete reasoning.
    input_schema: { $ref: '#/schemas/agent_result' }
    output_schema: { $ref: '#/schemas/agent_result' }
    confidence:
      metric: qualitative
      window: null
      value: null
    ethical_guardrails:
      - Block recommendations that violate policy or user consent
    self_regenerative: logs reflections after each run
flows:
  defaultNFL:
    stages:
      - parallel: [injuryScout, lineWatcher, statCruncher]
      - sequential: [guardianAgent]
    analytics: [trendsAgent]
dependencies:
  guardianAgent: [injuryScout, lineWatcher, statCruncher]
self_regenerative_logic:
  description: Agents append post-run reflections to logs and can propose configuration changes for future runs.
