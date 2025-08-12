-- Create live_games table
create table if not exists public.live_games (
  id uuid primary key default gen_random_uuid(),
  home_team text not null,
  away_team text not null,
  league text not null,
  time timestamptz not null,
  confidence numeric(4,3) not null,
  edge_pick jsonb[] not null default '{}',
  winner text not null,
  edge_delta numeric(4,3) not null,
  odds jsonb,
  status text not null default 'upcoming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create agent_reflections table
create table if not exists public.agent_reflections (
  id uuid primary key default gen_random_uuid(),
  agent text not null,
  message text not null,
  metadata jsonb,
  environment text not null,
  timestamp timestamptz not null default now()
);

-- Create agent_runs table
create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_id text not null,
  input jsonb not null,
  output jsonb,
  status text not null default 'pending',
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add indexes
create index if not exists idx_live_games_time on public.live_games (time);
create index if not exists idx_live_games_league on public.live_games (league);
create index if not exists idx_agent_reflections_agent on public.agent_reflections (agent);
create index if not exists idx_agent_runs_status on public.agent_runs (status);

-- Add updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers
create trigger set_live_games_updated_at
  before update on public.live_games
  for each row
  execute function public.set_updated_at();

create trigger set_agent_runs_updated_at
  before update on public.agent_runs
  for each row
  execute function public.set_updated_at();

-- Enable row level security
alter table public.live_games enable row level security;
alter table public.agent_reflections enable row level security;
alter table public.agent_runs enable row level security;

-- Create policies
create policy "Public live games are viewable by everyone"
  on public.live_games for select
  using (true);

create policy "Only authenticated users can view agent reflections"
  on public.agent_reflections for select
  using (auth.role() = 'authenticated');

create policy "Only authenticated users can insert agent reflections"
  on public.agent_reflections for insert
  with check (auth.role() = 'authenticated');

create policy "Only authenticated users can view agent runs"
  on public.agent_runs for select
  using (auth.role() = 'authenticated');

create policy "Only authenticated users can modify agent runs"
  on public.agent_runs for all
  using (auth.role() = 'authenticated');
