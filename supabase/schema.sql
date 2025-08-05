-- Supabase schema for EdgePicks

create table if not exists matchups (
  id uuid primary key default gen_random_uuid(),
  team_a text not null,
  team_b text not null,
  match_day int,
  agents jsonb not null,
  pick jsonb not null,
  actual_winner text,
  created_at timestamptz default now()
);
