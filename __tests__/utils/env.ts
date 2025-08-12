export function withNodeEnv(value: "development" | "test" | "production", fn: () => Promise<void> | void) {
  const old = process.env.NODE_ENV;
  // Use a mutable reference to bypass read-only restriction
  Object.defineProperty(process.env, 'NODE_ENV', {
    value,
    writable: true,
    configurable: true,
  });

  const maybePromise = fn();
  const restore = () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: old,
      writable: true,
      configurable: true,
    });
  };

  if (maybePromise && typeof (maybePromise as any).then === "function") {
    return (maybePromise as Promise<unknown>).finally(restore);
  }
  restore();
}
