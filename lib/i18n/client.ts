'use client';

import { useContext, useEffect } from 'react';
import { I18nContext } from './config';

export function useI18n(ns?: string) {
  const ctx = useContext(I18nContext);

  useEffect(() => {
    if (ns) {
      ctx.loadNamespace(ns);
    }
  }, [ns, ctx]);

  return ctx;
}

