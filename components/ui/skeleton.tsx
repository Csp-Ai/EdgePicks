'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    className={cn('animate-pulse rounded-md bg-gray-300 dark:bg-gray-700', className)}
    {...props}
  />
);

export default Skeleton;
