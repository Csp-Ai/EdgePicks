import './globals.css';
import type { ReactNode } from 'react';

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
