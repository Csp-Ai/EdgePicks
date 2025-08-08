export const colors = {
  bg: 'var(--color-bg)',
  fg: 'var(--color-fg)',
  primary: 'var(--color-primary)',
  muted: 'var(--color-muted)',
} as const;

export const space = {
  xs: 'var(--space-xs)',
  sm: 'var(--space-sm)',
  md: 'var(--space-md)',
  lg: 'var(--space-lg)',
  xl: 'var(--space-xl)',
} as const;

export const typography = {
  fontBody: 'var(--font-body)',
  fontHeading: 'var(--font-heading)',
  sizeSm: 'var(--font-size-sm)',
  sizeBase: 'var(--font-size-base)',
  sizeLg: 'var(--font-size-lg)',
} as const;

export const tokens = {
  colors,
  space,
  typography,
} as const;

export type Tokens = typeof tokens;
