# Agent Design Patterns

## 1. Agent Types & Roles

| Agent | Data Sources | Insights | Contribution | Registry Tag |
|-------|--------------|----------|--------------|--------------|
| **InjuryScout** | `espn`, team reports | Lineup availability and injury severity | Adjusts team strength based on player status | `{ name: "injuryScout", id: "injuryScout", category: "injury", league: "NFL" }` |
| **LineWatcher** | market odds feeds | Line movement and sharp money | Flags market shifts influencing confidence | `{ name: "lineWatcher", id: "lineWatcher", category: "line", league: "NFL" }` |
| **StatCruncher** | advanced stats APIs | Efficiency and matchup metrics | Quantifies historical performance trends | `{ name: "statCruncher", id: "statCruncher", category: "stat", league: "NFL" }` |
| **TrendsAgent** | Supabase historical tables | Momentum, hit rates, flow popularity | Provides context beyond box scores | `{ name: "trendsAgent", id: "trendsAgent", category: "analytics", league: "NFL" }` |
| **GuardianAgent** | — | Consistency and reasoning checks | Guards against inconsistent or low-confidence picks | `{ name: "guardianAgent", id: "guardianAgent", category: "guardian", league: "NFL" }` |

## 2. Code Structure Template

```ts
// AgentName.ts
import { fetchData } from './data';
import { AgentOutput } from './types';

export async function run(input: AgentInput): Promise<AgentOutput> {
  try {
    const parsed = parseInput(input);        // Input parsing
    const raw = await fetchData(parsed);     // Data fetch
    const score = scoreMatchup(raw);         // Scoring function
    return {                                 // Output shape
      agent: 'agentName',
      score,
      reasoning: buildReasoning(raw, score)
    };
  } catch (error) {
    logError(error, input);                  // Error handling
    throw error;
  }
}
```

## 3. Error Handling & Logging

- Wrap scoring logic in `try/catch` blocks.
- Log `error.message`, `error.stack`, and original `input`.
- Persist results and errors:
  - **Supabase**: insert into `agent_logs` table for centralized analysis.
  - **agentLogsStore**: append lightweight JSON entries for local debugging.

## 4. Metadata & Registry

Agents register in `lib/agents/agents.json` with:

```json
{
  "name": "injuryScout",
  "id": "injuryScout",
  "description": "Tracks player injuries and availability.",
  "category": "injury",
  "league": "NFL"
}
```

Required fields:
- `name` and `id`: unique identifiers.
- `description`: short summary.
- `category`: domain classification.
- `league`: supported league(s).

## 5. Testing & Debugging

- Provide unit tests for scoring logic with representative matchups.
- Mock external API calls to keep tests deterministic.
- Treat logs as first-class observability; view them in the dashboard's Agent Logs modal.

## 6. Codex Integration

- Codex parses top-level `//` comments for agent name and purpose.
- Use descriptive headers to enable automated prompt generation.
- Agents may opt into lifecycle auditing and doc sync by exporting `audit: true` in metadata.

## 7. Extensibility Best Practices

- Design for multiple leagues with pluggable data adapters.
- Implement fallback paths and feature toggles for experimental logic.
- Avoid tight coupling with UI components; instead emit lifecycle events and `confidence` scores for downstream display.

