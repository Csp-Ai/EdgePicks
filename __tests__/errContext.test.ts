import { withErrContext, formatErrForLog } from '../lib/logging/errContext';

describe('errContext', () => {
  test('preserves stack', () => {
    const err = new Error('boom');
    const stack = err.stack;
    const wrapped = withErrContext(err, { foo: 'bar' });
    expect(wrapped.stack).toBe(stack);
  });

  test('merges context', () => {
    const err = withErrContext(new Error('oops'), { foo: 'bar' });
    const merged = withErrContext(err, { bar: 'baz' });
    expect(merged.context).toEqual({ foo: 'bar', bar: 'baz' });
  });

  test('redacts secrets', () => {
    const err = withErrContext(new Error('nope'), {
      password: 'p',
      token: 't',
      nested: { secret: 's' },
      safe: 'ok',
    });
    const out = JSON.parse(formatErrForLog(err));
    expect(out.context.password).toBe('[REDACTED]');
    expect(out.context.token).toBe('[REDACTED]');
    expect(out.context.nested.secret).toBe('[REDACTED]');
    expect(out.context.safe).toBe('ok');
  });
});
