create table if not exists logs (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  payload jsonb,
  request_id text,
  user_id text,
  ts timestamptz not null default now()
);
