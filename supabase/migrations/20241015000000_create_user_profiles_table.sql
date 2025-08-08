create table if not exists user_profiles (
  user_id text primary key,
  has_seen_onboarding boolean not null default false
);
