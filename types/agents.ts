export type AgentName =
  | 'InjuryScout'
  | 'LineWatcher'
  | 'StatCruncher'
  | 'Trends'
  | 'Lifecycle'
  | 'PickBot'
  | string;

export interface AgentResult {
  name: AgentName;
  description?: string;
  weight?: number;
  /** 0..1 */
  score?: number;
  /** optional running estimate */
  confidenceEstimate?: number;
  details?: Record<string, unknown>;
  team?: string; // Added property
  reason?: string; // Added property
  warnings?: string[]; // Added property
  topReasons?: string[]; // Added optional topReasons property
}

export type AgentLifecycle =
  | { type: 'start'; agent: AgentName; status: 'started'; startedAt: string } // Added properties
  | { type: 'complete'; agent: AgentName; status: 'completed'; durationMs: number; endedAt: string } // Added properties
  | { type: 'error'; agent: AgentName; status: 'errored'; message: string; durationMs?: number; endedAt?: string }; // Added properties

export type AgentOutputs = Record<AgentName, AgentResult>;

export type AgentFunc = (args: unknown) => Promise<AgentResult>;
