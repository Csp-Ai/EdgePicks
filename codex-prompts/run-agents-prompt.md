# Purpose
Create an API route that runs the EdgePicks agent pipeline for a given NFL matchup. This route gathers data from InjuryScout, LineWatcher, and StatCruncher, processes them with PickBot, and returns a complete pick with confidence and reasoning.

# API Endpoint
`GET /api/run-agents?teamA=49ers&teamB=Cowboys&week=1`

# Responsibilities
1. Accept teamA, teamB, week from query params  
2. Call each modular agent:  
   - `injuryScout(matchup)`  
   - `lineWatcher(matchup)`  
   - `statCruncher(matchup)`  
3. Pass all results to `pickBot(agentsOutput)`  
4. Return a JSON response:

```ts
type AgentOutput = {
  injuryScout: InjuryReport;
  lineWatcher: LineMovementReport;
  statCruncher: StatMatchupReport;
};

type PickSummary = {
  winner: string;
  confidence: number;
  topReasons: string[];
};
```

# File to Generate
`pages/api/run-agents.ts`

# Notes
- Use TypeScript  
- Validate query params before processing  
- Use mocked data from agents if needed  
- Do not depend on Supabase yet — keep this backend-logic focused
