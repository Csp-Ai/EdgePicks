-- db/policies.test.sql
-- Validate RLS policies for logs, predictions, and matchups using pgTAP.

create extension if not exists pgtap;
create schema if not exists auth;

create or replace function auth.uid() returns text as $$
  select current_setting('request.jwt.claim.sub', true);
$$ language sql stable;

create or replace function auth.role() returns text as $$
  select current_setting('request.jwt.claim.role', true);
$$ language sql stable;

do $$
begin
  create role anon login;
  create role authenticated login;
  create role service_role login;
exception when duplicate_object then null;
end$$;

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;

begin;
select plan(14);

-- Seed data as service role
set role service_role;
select set_config('request.jwt.claim.role','service_role',true);
insert into matchups (team_a, team_b, agents, pick, flow, user_id, is_public) values
('A','B','{}'::jsonb,'{}'::jsonb,'football-pick','user1', false),
('C','D','{}'::jsonb,'{}'::jsonb,'football-pick','user2', true);
insert into logs (kind, user_id) values ('test1','user1'), ('test2','user2');
insert into predictions (user_id, matchup_id, prediction) values
('user1',(select id from matchups where user_id='user1'),'{}'::jsonb),
('user2',(select id from matchups where user_id='user2'),'{}'::jsonb);

-- anon role: only public matchups, no logs or predictions
set role anon;
select set_config('request.jwt.claim.role','anon',true);
select ok((select count(*) from matchups) = 1, 'anon sees only public matchups');
select is_empty('select * from logs', 'anon cannot read logs');
select is_empty('select * from predictions', 'anon cannot read predictions');

-- authenticated user1: own rows + public matchups
set role authenticated;
select set_config('request.jwt.claim.role','authenticated',true);
select set_config('request.jwt.claim.sub','user1',true);
select ok((select count(*) from logs) = 1, 'user1 sees own logs');
select ok((select count(*) from predictions) = 1, 'user1 sees own predictions');
select ok((select count(*) from matchups) = 2, 'user1 sees own and public matchups');
select throws_like('insert into logs(kind,user_id) values (''hack'',''user2'')', '%policy%', 'user1 cannot insert log for others');
select throws_like('insert into predictions(user_id, matchup_id) values (''user2'', (select id from matchups limit 1))', '%policy%', 'user1 cannot insert prediction for others');
select throws_like('insert into matchups(team_a,team_b,agents,pick,flow,user_id) values (''E'',''F'',''{}''::jsonb,''{}''::jsonb,''football-pick'',''user2'')', '%policy%', 'user1 cannot insert matchup for others');

-- authenticated user2: own rows, no access to user1 private matchup
set role authenticated;
select set_config('request.jwt.claim.role','authenticated',true);
select set_config('request.jwt.claim.sub','user2',true);
select ok((select count(*) from logs) = 1, 'user2 sees own logs');
select ok((select count(*) from matchups) = 1, 'user2 does not see user1 private matchup');

-- service role bypass
set role service_role;
select set_config('request.jwt.claim.role','service_role',true);
select ok((select count(*) from logs) = 2, 'service role reads all logs');
select ok((select count(*) from predictions) = 2, 'service role reads all predictions');
select ok((select count(*) from matchups) = 2, 'service role reads all matchups');

select finish();
rollback;
