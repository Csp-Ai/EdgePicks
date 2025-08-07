import fs from 'fs/promises';
import path from 'path';

export interface AgentLog {
  output?: any;
  durationMs?: number;
  error?: string;
}

const filePath = path.join(process.cwd(), 'agentLogsStore.json');

class Mutex {
  private queue: Promise<void> = Promise.resolve();
  async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    const res = this.queue.then(fn, fn);
    this.queue = res.then(() => undefined, () => undefined);
    return res;
  }
}

const mutex = new Mutex();

async function readStore(): Promise<Record<string, AgentLog>> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err: any) {
    if (err.code === 'ENOENT') return {};
    if (err instanceof SyntaxError) return {};
    throw err;
  }
}

async function writeStore(data: Record<string, AgentLog>): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function writeAgentLog(
  sessionId: string,
  agentId: string,
  data: AgentLog
): Promise<void> {
  await mutex.runExclusive(async () => {
    const store = await readStore();
    store[`${sessionId}:${agentId}`] = data;
    await writeStore(store);
  });
}

export async function readAgentLog(
  sessionId: string,
  agentId: string
): Promise<AgentLog | undefined> {
  return mutex.runExclusive(async () => {
    const store = await readStore();
    return store[`${sessionId}:${agentId}`];
  });
}

export async function getAllAgentLogs(): Promise<Record<string, AgentLog>> {
  return mutex.runExclusive(readStore);
}

export async function clearAgentLogs(): Promise<void> {
  await mutex.runExclusive(async () => {
    await writeStore({});
  });
}

