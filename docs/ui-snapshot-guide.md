# UI Snapshot Guide

The snapshot recorder captures screenshots of core UI components to help spot visual regressions and accessibility issues.

## Running

```bash
npx ts-node scripts/uiSnapshot.ts
```

Images are saved to the `__snapshots__/` directory. Each run is logged to `agentLogsStore.json` under `snapshotTaken` and a summary line is appended to `llms.txt`.

## CI

Add `npm run snap:test` to your CI pipeline to detect UI drift across pull requests.

