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
