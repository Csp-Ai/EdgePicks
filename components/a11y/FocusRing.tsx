import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

interface FocusRingProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export default function FocusRing({ children, className, ...props }: FocusRingProps) {
  return (
    <span
      className={cn('focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500', className)}
      {...props}
    >
      {children}
    </span>
  );
}
