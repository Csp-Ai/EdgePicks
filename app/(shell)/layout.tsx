import '../globals.css';
import Header from '../../components/ui/header';
import Toaster from '../../components/ui/toaster';
import Skeleton from '../../components/ui/skeleton';
import React, { Suspense } from 'react';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster>
          <Header />
          <main className="p-4">
            <Suspense fallback={<Skeleton className="h-8 w-full" />}>
              {children}
            </Suspense>
          </main>
        </Toaster>
      </body>
    </html>
  );
}
