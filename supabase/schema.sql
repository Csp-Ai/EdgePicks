-- Supabase schema for EdgePicks

create table if not exists matchups (
  id uuid primary key default gen_random_uuid(),
  team_a text not null,
  team_b text not null,
  match_day int,
  agents jsonb not null,
  pick jsonb not null,
  flow text not null default 'football-pick',
  actual_winner text,
  is_auto_pick boolean,
  extras jsonb,
  created_at timestamptz default now()
);

create table if not exists agent_stats (
  agent text primary key,
  wins int default 0,
  losses int default 0,
  accuracy float default 0
);

create table if not exists flow_stats (
  flow text primary key,
  wins int default 0,
  losses int default 0,
  accuracy float default 0
);

create table if not exists ui_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  session_type text,
  user_id text,
  extras jsonb,
  created_at timestamptz default now()
);

create table if not exists logs (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  request_id text,
  user_id text,
  payload jsonb,
  ts timestamptz default now()
);

create table if not exists agent_outcomes (
  game_id uuid not null references matchups(id) on delete cascade,
  agent text not null,
  pick text,
  correct boolean,
  confidence float,
  ts timestamptz default now(),
  primary key (game_id, agent)
);
