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
