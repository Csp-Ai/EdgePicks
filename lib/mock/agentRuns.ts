import { AgentRun } from '../events/agentEvents';

export const happyPath: AgentRun = {
  events: [
    { type: 'start', agentId: 'injuryScout', ts: 0 },
    {
      type: 'result',
      agentId: 'injuryScout',
      ts: 1000,
      payload: { team: 'Patriots', score: 0.6, reason: 'QB out for Jets' },
    },
    { type: 'end', agentId: 'injuryScout', ts: 1100 },
    { type: 'start', agentId: 'lineWatcher', ts: 1000 },
    {
      type: 'result',
      agentId: 'lineWatcher',
      ts: 2000,
      payload: { team: 'Patriots', score: 0.7, reason: 'Line moved -2' },
    },
    { type: 'end', agentId: 'lineWatcher', ts: 2100 },
    { type: 'start', agentId: 'statCruncher', ts: 2000 },
    {
      type: 'result',
      agentId: 'statCruncher',
      ts: 3000,
      payload: { team: 'Patriots', score: 0.65, reason: 'Efficiency edge' },
    },
    { type: 'end', agentId: 'statCruncher', ts: 3100 },
    { type: 'start', agentId: 'trendsAgent', ts: 3000 },
    {
      type: 'result',
      agentId: 'trendsAgent',
      ts: 4000,
      payload: { team: 'Patriots', score: 0.55, reason: 'Recent trend favoring Pats' },
    },
    { type: 'end', agentId: 'trendsAgent', ts: 4100 },
  ],
  final: {
    winner: 'Patriots',
    confidence: 0.72,
    reasons: ['Jets missing starting QB', 'Line moved 2 points toward NE'],
  },
};

export const errorRecovery: AgentRun = {
  events: [
    { type: 'start', agentId: 'injuryScout', ts: 0 },
    {
      type: 'error',
      agentId: 'injuryScout',
      ts: 500,
      payload: { warning: 'timeout' },
    },
    { type: 'start', agentId: 'injuryScout', ts: 1000 },
    {
      type: 'result',
      agentId: 'injuryScout',
      ts: 1500,
      payload: { team: 'Patriots', score: 0.58, reason: 'Recovered after retry' },
    },
    { type: 'end', agentId: 'injuryScout', ts: 1600 },
    { type: 'start', agentId: 'lineWatcher', ts: 1500 },
    {
      type: 'result',
      agentId: 'lineWatcher',
      ts: 2500,
      payload: { team: 'Patriots', score: 0.62, reason: 'Sharp money spotted' },
    },
    { type: 'end', agentId: 'lineWatcher', ts: 2600 },
  ],
  final: {
    winner: 'Patriots',
    confidence: 0.68,
    reasons: ['Recovered from error', 'Line movement supports Pats'],
  },
};

export const mockAgentRuns = {
  happyPath,
  errorRecovery,
};
