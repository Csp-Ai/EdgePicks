export function freezeTime(iso = '2025-01-01T00:00:00.000Z') {
  jest.useFakeTimers().setSystemTime(new Date(iso));
  return () => jest.useRealTimers();
}
