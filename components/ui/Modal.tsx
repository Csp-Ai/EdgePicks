import * as React from 'react';
import FocusTrap from '../a11y/FocusTrap';
import { cn } from '../../lib/utils';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  ...props
}) => {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const previouslyFocused = React.useRef<Element | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    contentRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onMouseDown={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={(e) =>
        (e.key === 'Enter' || e.key === ' ') && onClose()
      }
    >
      <FocusTrap>
        <div
          ref={contentRef}
          tabIndex={-1}
          className={cn('bg-white text-gray-900 p-6 rounded shadow-md focus:outline-none', className)}
          onMouseDown={stopPropagation}
          {...props}
        >
          <h2 id={titleId} className="text-lg font-semibold mb-4">
            {title}
          </h2>
          {children}
        </div>
      </FocusTrap>
    </div>
  );
};
