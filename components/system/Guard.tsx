import React, { ReactNode } from 'react';
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
  let authed = false;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    authed = !!useSession().data;
  } catch {
    // ignore – assume unauthenticated
  }

  let flagEnabled = false;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    flagEnabled = useFlag(flag ?? 'demoMode')[0];
  } catch {
    // ignore – flag remains disabled if provider missing
  }

  const allowed = authed || (flag ? flagEnabled : false);
  const render = allowed ? children : fallback;

  if (typeof render === 'function') {
    return <>{(render as () => ReactNode)()}</>;
  }
  return <>{render}</>;
}

