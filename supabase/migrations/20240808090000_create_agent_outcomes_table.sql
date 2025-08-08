create table if not exists agent_outcomes (
  game_id uuid not null references matchups(id) on delete cascade,
  agent text not null,
  pick text,
  correct boolean,
  confidence float,
  ts timestamptz not null default now(),
  primary key (game_id, agent)
);
