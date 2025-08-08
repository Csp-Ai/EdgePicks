const STORAGE_PREFIX = 'edgepicks.flag.';

function parseBool(value: string | null | undefined): boolean {
  if (value === undefined || value === null) return false;
  return value === '1' || value.toLowerCase() === 'true';
}

export function getFlag(name: string): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_PREFIX + name);
    if (stored !== null) {
      return parseBool(stored);
    }
  }

  const envKey = `NEXT_PUBLIC_FLAG_${name.toUpperCase()}`;
  const envVal = process.env[envKey];
  return parseBool(envVal);
}

export function setFlag(name: string, value: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_PREFIX + name, value ? '1' : '0');
  }
}
