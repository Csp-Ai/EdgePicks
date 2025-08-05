export const pseudoMetric = async (seed: string, mod: number): Promise<number> => {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return hash % mod;
};
