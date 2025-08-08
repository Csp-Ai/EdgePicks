const ORIGINAL_DATE = Date;
const FIXED_ISO = '2024-01-01T00:00:00.000Z';

export function freezeTime(iso: string = FIXED_ISO) {
  const fixed = new Date(iso);
  class MockDate extends Date {
    constructor(...args: any[]) {
      if (args.length === 0) {
        super(fixed.getTime());
      } else {
        // @ts-ignore
        super(...args);
      }
    }
    static now() {
      return fixed.getTime();
    }
  }
  // @ts-ignore
  global.Date = MockDate;
}

export function resetTime() {
  // @ts-ignore
  global.Date = ORIGINAL_DATE;
}
