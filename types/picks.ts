export interface PickSummary {
  winner: string;
  /** 0..1 */
  confidence: number;
}

export interface Reason {
  agent: string;
  weight?: number;          // 0..1
  explanation: string;
}

export interface PickWithReasoning extends PickSummary {
  /** canonical name (was topReasons in a few places) */
  reasons: Reason[];
}
