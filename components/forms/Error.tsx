import * as React from 'react';
import { cn } from '@/lib/utils';
import { useFieldContext } from './Field';

export interface ErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Error = React.forwardRef<HTMLParagraphElement, ErrorProps>(
  ({ className, ...props }, ref) => {
    const { error, errorId } = useFieldContext();
    if (!error) return null;
    return (
      <p
        ref={ref}
        id={errorId}
        className={cn('text-sm text-red-600', className)}
        {...props}
      >
        {error}
      </p>
    );
  }
);
Error.displayName = 'Error';
