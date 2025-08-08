export interface FuzzyOptions<T> {
  keys: (keyof T)[];
}

interface Scored<T> {
  item: T;
  score: number;
}

function scoreText(text: string, query: string): number {
  let tIndex = 0;
  let score = 0;
  for (const char of query) {
    const idx = text.indexOf(char, tIndex);
    if (idx === -1) return Infinity;
    score += idx - tIndex;
    tIndex = idx + 1;
  }
  return score;
}

export function createFuzzySearch<T>(items: T[], options: FuzzyOptions<T>) {
  const { keys } = options;
  return (query: string): T[] => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    const scored: Scored<T>[] = items.map((item) => {
      const text = keys
        .map((k) => String(item[k]).toLowerCase())
        .join(' ');
      return { item, score: scoreText(text, q) };
    });

    return scored
      .filter((s) => s.score !== Infinity)
      .sort((a, b) => a.score - b.score)
      .map((s) => s.item);
  };
}

export default createFuzzySearch;
