import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

type Props = ComponentPropsWithoutRef<typeof Link>;

export default function NoPrefetchLink({ children, prefetch, ...props }: Props) {
  return (
    <Link prefetch={prefetch ?? false} {...props}>
      {children}
    </Link>
  );
}
