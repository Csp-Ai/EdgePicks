import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'px-4 py-2 bg-blue-600 text-white rounded-md transition-colors hover:bg-blue-500 focus:outline-none',
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
