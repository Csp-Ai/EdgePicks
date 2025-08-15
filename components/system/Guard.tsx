import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useFlag } from '@/lib/flags/useFlag';
import type { FlagKey } from '@/lib/flags/experiments';

interface GuardProps {
  children: ReactNode | (() => ReactNode);
  fallback?: ReactNode | (() => ReactNode);
  /** Feature flag that grants access when enabled */
  flag?: FlagKey;
}

/**
 * Render-prop wrapper that gates content behind authentication or a feature flag.
 */
export default function Guard({ children, fallback = null, flag }: GuardProps) {
  const { data: session } = useSession();
  const [flagEnabled] = useFlag(flag ?? 'demoMode');

  const allowed = !!session || (flag ? flagEnabled : false);
  const render = allowed ? children : fallback;

  if (typeof render === 'function') {
    return <>{(render as () => ReactNode)()}</>;
  }
  return <>{render}</>;
}

