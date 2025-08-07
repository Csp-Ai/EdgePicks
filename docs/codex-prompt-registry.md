# Codex Prompt Registry

The Codex Prompt Registry aggregates historical prompt metadata from `llms.txt` and the Git commit history. Use `scripts/generatePromptRegistry.ts` to rebuild the registry and write the results to `data/prompt-registry.json`.

## Entry Structure
Each registry entry contains:

- `source`: `"llms"` or `"pr"`
- `timestamp`: ISO timestamp when available
- `header`: prompt title or commit subject
- `summary`: short description of the prompt
- `commit`: commit hash when sourced from PR history

## Regeneration
Run:

```bash
npx ts-node scripts/generatePromptRegistry.ts
```

The dashboard at `/codex/prompts` loads this JSON to provide a searchable interface for auditing past prompts.
