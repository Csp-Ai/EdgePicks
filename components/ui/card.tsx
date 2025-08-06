import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div
    className={cn(
      'p-6 rounded-2xl shadow-xl bg-zinc-900',
      className
    )}
    {...props}
  />
);
