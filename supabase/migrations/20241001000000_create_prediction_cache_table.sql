create table if not exists prediction_cache (
  key text primary key,
  value jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
