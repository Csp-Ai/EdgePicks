import { logUiEvent } from '../logUiEvent';

export async function logAdapterMetric(
  adapter: string,
  metric: string,
  metadata: Record<string, unknown> = {},
  correlationId?: string,
): Promise<void> {
  await logUiEvent('adapterMetric', { adapter, metric, ...metadata }, correlationId);
}
