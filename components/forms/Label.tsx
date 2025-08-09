import * as React from 'react';
import { cn } from '../../lib/utils';
import { useFieldContext } from './Field';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    const { id } = useFieldContext();
    return (
      <label
        ref={ref}
        htmlFor={id}
        className={cn('text-sm font-medium text-gray-700', className)}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';
