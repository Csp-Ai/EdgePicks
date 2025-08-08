create schema if not exists auth;

create or replace function auth.uid() returns text as $$
  select current_setting('request.jwt.claim.sub', true);
$$ language sql stable;

create or replace function auth.role() returns text as $$
  select current_setting('request.jwt.claim.role', true);
$$ language sql stable;

create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  matchup_id uuid references matchups(id) on delete cascade,
  prediction jsonb,
  created_at timestamptz default now()
);

-- Ensure matchups has ownership and visibility columns
alter table matchups add column if not exists user_id text;
alter table matchups add column if not exists is_public boolean default false;


create index if not exists logs_user_id_ts_idx on logs (user_id, ts);
create index if not exists matchups_user_id_idx on matchups (user_id);
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
create policy "Users can update their logs" on logs
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "Service role full access to logs" on logs
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Predictions policies
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
