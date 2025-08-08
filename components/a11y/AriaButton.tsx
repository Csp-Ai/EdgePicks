import { cn } from '@/lib/utils';
import { ReactNode, KeyboardEvent, HTMLAttributes } from 'react';

interface AriaButtonProps extends HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
  children: ReactNode;
}

export function AriaButton({ onClick, className, children, ...props }: AriaButtonProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn('cursor-pointer', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default AriaButton;
