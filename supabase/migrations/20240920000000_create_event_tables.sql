-- Create/modify event tables with correlation IDs
alter table if exists ui_events rename column extras to metadata;
alter table if exists ui_events drop column if exists session_type;
alter table if exists ui_events add column if not exists correlation_id text;

create table if not exists agent_events (
  id uuid primary key default gen_random_uuid(),
  correlation_id text,
  agent_id text,
  event text not null,
  metadata jsonb,
  user_id text,
  created_at timestamptz not null default now()
);

create index if not exists ui_events_user_id_created_at_idx on ui_events (user_id, created_at);
create index if not exists ui_events_correlation_id_idx on ui_events (correlation_id);
create index if not exists agent_events_user_id_created_at_idx on agent_events (user_id, created_at);
create index if not exists agent_events_correlation_id_idx on agent_events (correlation_id);

alter table ui_events enable row level security;
alter table agent_events enable row level security;

create policy "Users can view their ui events" on ui_events
  for select using (auth.uid() = user_id);
create policy "Users can insert their ui events" on ui_events
  for insert with check (auth.uid() = user_id);
create policy "Service role full access to ui events" on ui_events
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Users can view their agent events" on agent_events
  for select using (auth.uid() = user_id);
create policy "Users can insert their agent events" on agent_events
  for insert with check (auth.uid() = user_id);
create policy "Service role full access to agent events" on agent_events
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
