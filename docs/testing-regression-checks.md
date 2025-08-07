# Testing Regression Checks

Snapshot tests guard against silent breakages in critical files and UI.

## Lifecycle Logs

`__tests__/lifecycle.test.ts` snapshots `agentLogsStore.json` to detect unexpected
changes to recorded agent lifecycle events.

## UI Snapshot

`__tests__/uiSnapshot.test.ts` captures the default render of `AgentStatusPanel`
so visual structure changes require an intentional snapshot update.

## Codex Log

`__tests__/llmsLog.test.ts` hashes `llms.txt` to flag undocumented Codex log updates.

Run `npm test` to refresh snapshots. CI runs lint and these tests via
`.github/workflows/ci-tests.yml`.
