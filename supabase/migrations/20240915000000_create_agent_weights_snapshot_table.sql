create table if not exists agent_weights_snapshot (
  agent text not null,
  alpha float not null,
  beta float not null,
  weight float not null,
  sample_size int not null,
  ts timestamptz not null default now(),
  primary key (agent, ts)
);
