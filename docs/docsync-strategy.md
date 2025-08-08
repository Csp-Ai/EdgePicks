# DocSync Retry & Failover Strategy

DocSync ensures documentation updates make it to the GitHub wiki even when
external services are unavailable. Failed sync attempts are written to
`agentLogsStore.json` and can be retried later.

## Required Environment Variables

`scripts/docsync-agent.ts` needs access to both Supabase and your GitHub wiki.
Set the following variables in your environment or `.env.local`:

| Variable | Purpose | Where to Obtain |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key used to mark Codex logs as synced | Supabase Dashboard → Project Settings → API |
| `GH_PAT` | GitHub Personal Access Token with `repo` scope for wiki updates | GitHub Settings → Developer settings → Personal access tokens |
| `GH_OWNER` | Owner of the target GitHub repository | Repository owner name |
| `GH_REPO` | Repository name | Repository name |
| `WIKI_BRANCH` | Branch of the wiki repository to update (e.g., `main`) | Usually `main` |

```bash
# example
GH_OWNER=acme
GH_REPO=edgepicks
WIKI_BRANCH=main
```

## Features
- **Dry Run:** `scripts/docsync-agent.ts` accepts a `--dry-run` flag to validate
  environment configuration without making network calls.
- **Failure Logging:** Any sync failure appends a record to
  `agentLogsStore.json` with the error message and command executed.
- **Retry Script:** `scripts/retry-docsync.ts` replays unsynced commands from
  `agentLogsStore.json`, marking entries as synced on success.

## Usage
1. `npx ts-node scripts/docsync-agent.ts --dry-run` to verify setup.
2. Run `npx ts-node scripts/docsync-agent.ts` for a real sync.
3. If a sync fails, execute `npx ts-node scripts/retry-docsync.ts` once the
   environment is fixed to replay missed jobs.

## Fail-Open Mode

Running DocSync with `--fail-open` allows pipelines to continue even when
syncing fails. The script opens a GitHub issue and exits with code 0 instead of
halting.

```bash
npx ts-node scripts/docsync-agent.ts --fail-open
```

- `--dry-run` skips the actual GitHub API call and prints the issue it would
  create.
- `--repo owner/name` overrides `GITHUB_REPOSITORY` for issue creation.

The issue title follows `[DocSync Failure] <logId> @ <timestamp>` and the body
includes the error stack, commit SHA, and log ID. Set `GITHUB_TOKEN` and
`GITHUB_REPOSITORY` in the environment when using fail-open.

> **Security:** The token only needs `repo` scope to create issues. Keep it
> secret and scoped to the target repository.
