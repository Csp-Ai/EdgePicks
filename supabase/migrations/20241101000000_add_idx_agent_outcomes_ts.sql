create index if not exists idx_agent_outcomes_ts on agent_outcomes (ts desc);
-- rollback: drop index if exists idx_agent_outcomes_ts;
