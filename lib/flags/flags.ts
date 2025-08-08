import { experiments, FlagKey } from './experiments';

const STORAGE_PREFIX = 'ff.';

function parse(value: string | null | undefined): boolean | undefined {
  if (value == null) return undefined;
  const v = value.toLowerCase();
  if (['1', 'true', 'on', 'yes'].includes(v)) return true;
  if (['0', 'false', 'off', 'no'].includes(v)) return false;
  return undefined;
}

export function getFlag(key: FlagKey): boolean {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const urlVal = parse(params.get(`ff.${key}`));
    if (urlVal !== undefined) return urlVal;

    const storedVal = parse(localStorage.getItem(STORAGE_PREFIX + key));
    if (storedVal !== undefined) return storedVal;
  }

  const envKey = `NEXT_PUBLIC_FF_${key.toUpperCase()}`;
  const envVal = parse(process.env[envKey]);
  if (envVal !== undefined) return envVal;

  return experiments[key];
}

export function setFlag(key: FlagKey, value: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_PREFIX + key, value ? 'on' : 'off');
  }
}
