import React, { Suspense } from 'react';
import nextDynamic from 'next/dynamic';
import Skeleton from '@/components/ui/skeleton';
export const revalidate = 60 as const;
export const dynamic = 'auto';
const AboutContent = nextDynamic(() => import('@/components/ui/about-content'), {
  suspense: true,
});

export default function AboutPage() {
  return (
    <Suspense fallback={<Skeleton className="h-8 w-full" />}>
      <AboutContent />
    </Suspense>
  );
}
