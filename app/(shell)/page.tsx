import React, { Suspense } from 'react';
import nextDynamic from 'next/dynamic';
import Skeleton from '../../components/ui/skeleton';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const Welcome = nextDynamic(() => import('../../components/ui/welcome'), {
  suspense: true,
});

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-8 w-full" />}>
      <Welcome />
    </Suspense>
  );
}
