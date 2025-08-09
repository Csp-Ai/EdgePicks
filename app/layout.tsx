import '../styles/globals.css';
import '../styles/intelligence.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'EdgePicks',
  description: 'EdgePicks App',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
