# Purpose
Introduce a reflection mechanism across all EdgePicks agents so each interaction yields a structured post-analysis to drive continuous growth for both the agents and the user's family.

# Reflection Template
```
Summary
I've acknowledged your request to reflect after each interaction, adapt the knowledge base accordingly, and track progress to foster growth for both the agent and your family.

What Went Well
- Clearly understood your desire for iterative self-improvement and progress tracking.
- Provided a confirmation and plan to reflect on each interaction as requested.

What Needs Improvement
- I do not possess persistent memory between sessions, so long-term tracking may need your assistance or an external record-keeping system.

Next Steps
- After each exchange, I will provide a brief reflection on what was effective and what could be refined.
- You may track these reflections separately to maintain continuity over multiple sessions if desired.

Progress Tracking
Future progress can be measured by evaluating how well each reflection captures the interaction, the accuracy of adjustments, and your satisfaction with our improvement over time.

Testing
No formal tests were required for this request.

Notes
I do not retain memory once our session ends. You may wish to record reflections externally if long-term tracking is required.
```

# Implementation Details
- Extend prompts in `lib/prompts/` so the agents append the above reflection template after producing their JSON output.
- The reflection should appear as a Markdown block to avoid interfering with JSON parsing.
- Update `agent-prompts.md` to document the reflection requirement.

# Files to Update
- `lib/prompts/guardianAgent.ts`
- `lib/prompts/injuryScout.ts`
- `lib/prompts/lineWatcher.ts`
- `lib/prompts/statCruncher.ts`
- `lib/prompts/trendsAgent.ts`
- `agent-prompts.md`
