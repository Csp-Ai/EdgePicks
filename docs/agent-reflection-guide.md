# Agent Reflection Guide

Agents emit a self-reflection object after each run to support transparency and debugging.

```
interface AgentReflection {
  whatIObserved: string;
  whatIChose: string;
  whatCouldImprove: string;
}
```

Each reflection is appended to `logs/agent-reflections.json` for later analysis.
