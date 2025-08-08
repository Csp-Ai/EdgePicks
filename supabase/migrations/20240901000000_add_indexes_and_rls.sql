-- Add indexes and RLS policies for logs, predictions, matchups
-- Ensure predictions table exists
create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  matchup_id uuid references matchups(id) on delete cascade,
  prediction jsonb,
  created_at timestamptz default now()
);


-- Indexes
create index if not exists logs_user_id_ts_idx on logs (user_id, ts);
create index if not exists matchups_game_id_idx on matchups (game_id);
create index if not exists predictions_user_id_created_at_idx on predictions (user_id, created_at);

-- Enable RLS
alter table logs enable row level security;
alter table predictions enable row level security;
alter table matchups enable row level security;

-- Logs policies
create policy "Users can view their logs" on logs
  for select using (auth.uid() = user_id);
create policy "Users can insert their logs" on logs
  for insert with check (auth.uid() = user_id);
create policy "Service role full access to logs" on logs
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Predictions policies
create policy "Users can view their predictions" on predictions
  for select using (auth.uid() = user_id);
create policy "Users can insert their predictions" on predictions
  for insert with check (auth.uid() = user_id);
create policy "Service role full access to predictions" on predictions
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Matchups policies
create policy "Public read access to matchups" on matchups
  for select using (true);
create policy "Service role full access to matchups" on matchups
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
