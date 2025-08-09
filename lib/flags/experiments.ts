export const experiments = {
  agentGallery: false,
  agentBuilder: false,
  demoMode: false,
  trustScore: false,
  logStreamV2: false,
  i18n: false,
  nativeShare: false,
  agentInterface: false,
} as const;

export type FlagKey = keyof typeof experiments;
