import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Skeleton from '../../components/ui/skeleton';

const Welcome = dynamic(() => import('../../components/ui/welcome'), {
  suspense: true,
});

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-8 w-full" />}>
      <Welcome />
    </Suspense>
  );
}
