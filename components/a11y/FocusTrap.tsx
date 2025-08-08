import { useEffect, useRef, ReactNode } from 'react';

interface FocusTrapProps {
  active?: boolean;
  children: ReactNode;
}

export default function FocusTrap({ active = true, children }: FocusTrapProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    const selector =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(node.querySelectorAll<HTMLElement>(selector));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          (last || first).focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          (first || last).focus();
        }
      }
    };

    node.addEventListener('keydown', handleKey);
    return () => node.removeEventListener('keydown', handleKey);
  }, [active]);

  return <div ref={ref}>{children}</div>;
}
