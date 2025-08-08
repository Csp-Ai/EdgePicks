export function freezeTime(iso = '2025-01-01T00:00:00.000Z') {
  const now = Date.parse(iso);
  const spy = jest.spyOn(Date, 'now').mockReturnValue(now);
  return () => spy.mockRestore();
}
