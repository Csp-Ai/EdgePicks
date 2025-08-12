export function installMockEventSource() {
  class MockES {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSED = 2;

    onmessage: ((ev: MessageEvent) => unknown) | null = null;
    onopen: ((ev: Event) => unknown) | null = null;
    onerror: ((ev: Event) => unknown) | null = null;

    constructor(public url: string) {}
    close() {}
    // helper to push messages in tests
    __emit(data: unknown) {
      this.onmessage?.({ data: JSON.stringify(data) } as unknown as MessageEvent);
    }
  }
  // Install on global
  // Cast via unknown first to satisfy TS2352
  (globalThis as any).EventSource = MockES as unknown as typeof EventSource;
  return MockES;
}
