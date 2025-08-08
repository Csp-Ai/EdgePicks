import '../styles/globals.css';

import '../styles/typography.css';
import '../styles/intelligence.css';

export const metadata = {
  title: 'EdgePicks',
  description: 'EdgePicks App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
=======
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>

    </html>
  );
}
