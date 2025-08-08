const STORAGE_KEY = 'edgepicks.onboarding.step';

export function getProgress(): number {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(STORAGE_KEY);
  const step = parseInt(raw ?? '', 10);
  return Number.isFinite(step) ? step : 0;
}

export function setProgress(step: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(step));
  }
}

export function clearProgress(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export { STORAGE_KEY };
