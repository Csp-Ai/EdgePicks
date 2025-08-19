export type Role = 'scout' | 'analyst' | 'model' | 'arbiter';

export const ROLE_COLOR: Record<Role, string> = {
  scout: '#60a5fa',
  analyst: '#f59e0b',
  model: '#34d399',
  arbiter: '#94a3b8',
};

// Non-color patterns for a11y legend and graph rendering
export const ROLE_PATTERN: Record<Role, string> = {
  scout: 'solid',
  analyst: 'dashed',
  model: 'dotted',
  arbiter: 'double',
};

// Canvas line dash equivalents for patterns above
export const ROLE_DASH: Record<Role, number[]> = {
  scout: [],
  analyst: [4, 2],
  model: [1, 2],
  arbiter: [6, 2, 1, 2],
};
