export function freezeTime(iso = '2024-01-01T00:00:00.000Z') {
  const fixed = new Date(iso).valueOf();
  const spy = jest.spyOn(Date, 'now').mockReturnValue(fixed);
  return () => spy.mockRestore();
}
