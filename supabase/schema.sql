-- Supabase schema for EdgePicks

create schema if not exists auth;

create or replace function auth.uid() returns text as $$
  select current_setting('request.jwt.claim.sub', true);
$$ language sql stable;

create or replace function auth.role() returns text as $$
  select current_setting('request.jwt.claim.role', true);
$$ language sql stable;

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
  created_at timestamptz default now(),
  user_id text,
  is_public boolean default false
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
create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  matchup_id uuid references matchups(id) on delete cascade,
  prediction jsonb,
  created_at timestamptz default now()
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

-- Indexes
create index if not exists logs_user_id_ts_idx on logs (user_id, ts);
create index if not exists matchups_user_id_idx on matchups (user_id);
create index if not exists predictions_user_id_created_at_idx on predictions (user_id, created_at);

-- Row Level Security policies
alter table logs enable row level security;
alter table predictions enable row level security;
alter table matchups enable row level security;

create policy "Users can view their logs" on logs
  for select using (auth.uid() = user_id);
create policy "Users can insert their logs" on logs
  for insert with check (auth.uid() = user_id);
create policy "Users can update their logs" on logs
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "Service role full access to logs" on logs
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Users can view their predictions" on predictions
  for select using (auth.uid() = user_id);
create policy "Users can insert their predictions" on predictions
  for insert with check (auth.uid() = user_id);
create policy "Users can update their predictions" on predictions
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "Service role full access to predictions" on predictions
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Public read access to matchups" on matchups
  for select using (is_public or auth.uid() = user_id);
create policy "Users can insert their matchups" on matchups
  for insert with check (auth.uid() = user_id);
create policy "Users can update their matchups" on matchups
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "Service role full access to matchups" on matchups
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
