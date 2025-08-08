export type Purpose = 'researcher' | 'clinician' | 'advocate' | 'builder';
export type ConsentTier = 'low' | 'medium' | 'high';
export type SustainabilityMode = 'off' | 'balanced' | 'max';

export interface Profile {
  purpose: Purpose;
  consent: ConsentTier;
  sustainability: SustainabilityMode;
}

const KEY = 'edgepicks.profile';

export function saveProfile(profile: Profile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(profile));
}

export function getProfile(): Profile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

