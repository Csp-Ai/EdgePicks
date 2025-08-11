import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'primaryCTA';
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default:
    'px-4 py-2 bg-blue-600 text-white rounded-md transition-colors hover:bg-blue-500 focus-visible:outline-none',
  primary:
    'px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
  primaryCTA:
    'px-6 py-3 rounded-md text-white shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 transition-all hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 animate-pulse hover:animate-none',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';
