-- db/policies.test.sql
-- Validate RLS policies for logs, predictions, and matchups tables.
-- Uses pgTAP style tests.

begin;
select plan(7);

-- Seed data as service role
set role service_role;
insert into logs (kind, user_id) values ('test', 'user1');
insert into predictions (user_id, created_at) values ('user1', now());
insert into matchups (team_a, team_b, agents, pick, flow) values ('A', 'B', '{}'::jsonb, '{}'::jsonb, 'football-pick');

-- anon role: can read matchups but not logs or predictions
set role anon;
select ok((select count(*) from matchups) > 0, 'anon can read matchups');
select throws_like('select * from logs', '%policy%', 'anon cannot read logs');
select throws_like('select * from predictions', '%policy%', 'anon cannot read predictions');

-- service role: full access
set role service_role;
select ok((select count(*) from logs) = 1, 'service role can read logs');
select ok((select count(*) from predictions) = 1, 'service role can read predictions');

-- authenticated user: access only own rows
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"user1"}', true);
select ok((select count(*) from logs) = 1, 'user1 can read own logs');
select ok((select count(*) from predictions) = 1, 'user1 can read own predictions');

select finish();
rollback;
