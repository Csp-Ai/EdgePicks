import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Skeleton from '../../../components/ui/skeleton';

const AboutContent = dynamic(() => import('../../../components/ui/about-content'), {
  suspense: true,
});

export default function AboutPage() {
  return (
    <Suspense fallback={<Skeleton className="h-8 w-full" />}>
      <AboutContent />
    </Suspense>
  );
}
