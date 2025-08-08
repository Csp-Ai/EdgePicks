# API Routes

- /api/accuracy
- /api/dev-login
- /api/log-status
- /api/logs
- /api/reflections
- /api/run-agents
- /api/run-predictions
- /api/trends
- /api/upcoming-games

## Data Adapter Guarantees

Live data adapters for injuries, odds, and stats enforce strict Zod schemas and
abort provider requests after 3s. Responses are cached using the configured
`CACHE_DRIVER` and failures increment an error budget. When the budget is
exhausted, a 10‑minute circuit breaker returns mock data. Metrics for adapter
success and failure are emitted via `logUiEvent`.
