import * as React from 'react';
import { cn } from '@/lib/utils';

export const TypographyH1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h1 className={cn('text-4xl font-bold leading-snug', className)} {...props}>
    {children}
  </h1>
);

export const TypographyMuted: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-muted-foreground', className)} {...props} />
);
