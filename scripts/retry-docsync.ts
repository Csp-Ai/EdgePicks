import fs from "fs";
import { execSync } from "child_process";

interface AgentLogEntry {
  command: string;
  synced: boolean;
  output?: string;
  syncAttemptedAt?: string;
  syncError?: string;
}

export async function run() {
  const path = "agentLogsStore.json";
  if (!fs.existsSync(path)) {
    console.log("agentLogsStore.json not found");
    return;
  }
  const logs: AgentLogEntry[] = JSON.parse(fs.readFileSync(path, "utf8"));
  for (const log of logs) {
    if (!log.synced && log.command) {
      try {
        const out = execSync(log.command).toString();
        log.output = out;
        log.synced = true;
        log.syncAttemptedAt = new Date().toISOString();
        delete log.syncError;
      } catch (err: any) {
        log.output = err?.stdout?.toString() || "";
        log.syncError = err?.message || String(err);
        log.syncAttemptedAt = new Date().toISOString();
      }
    }
  }
  fs.writeFileSync(path, JSON.stringify(logs, null, 2));
}

if (require.main === module) {
  run();
}
