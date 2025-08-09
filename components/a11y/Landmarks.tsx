import { cn } from '@/lib/utils';
import { ReactNode, HTMLAttributes } from 'react';

type LandmarkElement = 'nav' | 'main' | 'aside' | 'section' | 'header' | 'footer';

interface LandmarksProps extends HTMLAttributes<HTMLElement> {
  /**
   * Landmark element to render. Defaults to `nav`.
   */
  as?: LandmarkElement;
  /**
   * Accessible name for the landmark.
   */
  label: string;
  children: ReactNode;
}

export default function Landmarks({
  as = 'nav',
  label,
  className,
  children,
  ...props
}: LandmarksProps) {
  const Tag = as as keyof JSX.IntrinsicElements;
  const extraProps = as === 'main' ? { id: 'main' } : {};

  return (
    <Tag aria-label={label} className={cn(className)} {...extraProps} {...props}>
      {children}
    </Tag>
  );
}
