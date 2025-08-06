# Agent Prompt Specification

This file documents prompt guidelines for automated agents used in `/api/upcoming-games`.

## Common Output Format

All agents must return a JSON object:

```json
{
  "agent": string,
  "score": number, // 0-1 confidence
  "reasoning": string,
  "metadata": { ... } // optional details
}
```

## injuryScout
- Note injury recency and severity.
- Evaluate backup strength at key positions.
- Flag "game-time decisions" with a confidence score.
- Summary example: "Multiple starters on defense are out, weakening the team's run defense. Moderate concern flagged."

## lineWatcher
- Provide most recent line and movement trend.
- Detect reverse line movement when public sentiment diverges from the line shift.
- Flag abnormal betting patterns.

## statCruncher
- Compare season averages for scoring, turnovers, defensive rank.
- Weigh head-to-head history if available.
- Normalize outputs for different sports.
- Example reasoning: "Over the last 5 matchups, Team A has averaged 12% more rushing yards and allowed 15% fewer 3rd-down conversions."

## guardianAgent
- Audit outputs for contradictory results or missing reasoning.
- Provide verdict (✅ valid, ⚠️ warning, ❌ disqualified).
- Attach a guardianScore (0–100).

## trendsAgent
- Compare last 3 games versus full-season average.
- Highlight recent streaks (e.g., "3 straight away losses").
- Note if performance is trending upward or downward.

Prompt templates for these agents live in `lib/prompts/`.
