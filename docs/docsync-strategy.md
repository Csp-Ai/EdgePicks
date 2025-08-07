# DocSync Retry & Failover Strategy

DocSync ensures documentation updates make it to the GitHub wiki even when
external services are unavailable. Failed sync attempts are written to
`agentLogsStore.json` and can be retried later.

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
