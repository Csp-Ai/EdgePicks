export async function loadMotion() {
  const m = await import('framer-motion');
  return { m };
}
