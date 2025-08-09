'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-md bg-gray-300 dark:bg-gray-700',
      className,
    )}
    {...props}
  >
    <div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent motion-safe:animate-shimmer motion-reduce:hidden"
    />
  </div>
);

export default Skeleton;
