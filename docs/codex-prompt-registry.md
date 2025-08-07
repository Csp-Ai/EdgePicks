# Codex Prompt Registry


`llms.txt` records commit summaries and prompts for this repository. To prevent reused prompts or hallucinated commit links, the registry is audited on each push.

## Audit Script

The `scripts/diff-llms-summary.ts` script compares the current `llms.txt` against the previous commit. It flags:

- Summaries that repeat for different commits
- Entries referencing commit hashes that do not exist

Results are written to `llms-audit.json` and the script exits non-zero when mismatches occur.

Run manually with:

```bash
npx ts-node scripts/diff-llms-summary.ts
```
=======
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

