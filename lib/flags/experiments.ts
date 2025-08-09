export const flags = {
  agentGallery: false,
  agentBuilder: false,
  demoMode: false,
  trustScore: false,
  logStreamV2: false,
  i18n: false,
  nativeShare: false,
  agentInterface: process.env.FEATURE_AGENT_INTERFACE === "true",
} as const;

export type FlagKey = keyof typeof flags;
