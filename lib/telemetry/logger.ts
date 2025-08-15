import { supabaseClient, supabaseServer } from '../supabaseClient';

export interface TelemetryEvent {
  level: 'debug' | 'info' | 'warn' | 'error';
  name: string;
  meta?: Record<string, unknown>;
}

export interface TelemetrySink {
  log(event: TelemetryEvent): Promise<void> | void;
}

class ConsoleSink implements TelemetrySink {
  log({ level, name, meta }: TelemetryEvent): void {
    const fn = (console as any)[level] || console.log;
    fn(`[${name}]`, meta);
  }
}

class SupabaseSink implements TelemetrySink {
  async log({ level, name, meta }: TelemetryEvent): Promise<void> {
    const entry = { level, name, meta, ts: new Date().toISOString() };
    const client =
      typeof window === 'undefined' ? supabaseServer() : supabaseClient;
    const { error } = await client.from('telemetry').insert(entry);
    if (error) {
      console.error('Failed to log telemetry event', error);
    }
  }
}

let sink: TelemetrySink;

if (process.env.NODE_ENV === 'production') {
  sink = new SupabaseSink();
} else {
  sink = new ConsoleSink();
}

export async function logEvent(event: TelemetryEvent): Promise<void> {
  await sink.log(event);
}

