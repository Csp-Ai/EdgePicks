// Ensure originalFetch exists and is a bound function
if (typeof globalThis.fetch === "function" && typeof (globalThis as any).originalFetch !== "function") {
  (globalThis as any).originalFetch = globalThis.fetch.bind(globalThis);
}

