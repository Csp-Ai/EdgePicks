"use client";

import * as React from "react";
let ThemeProviderImpl: any = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Lazy-load next-themes on client only; avoids SSR build errors if package missing or treeshaken
import("next-themes")
  .then((m) => {
    ThemeProviderImpl = m.ThemeProvider;
  })
  .catch(() => {
    /* no-op fallback */
  });

import { Toaster } from "@/components/ui/sonner-toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviderImpl attribute="class" defaultTheme="dark" enableSystem>
      {children}
      <Toaster />
    </ThemeProviderImpl>
  );
}

