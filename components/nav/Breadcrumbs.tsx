'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';

type Crumb = { label: string; href?: string };
type Props = {
  items: Crumb[];
  className?: string;
  listClassName?: string;
};

export default function Breadcrumbs({ items, className, listClassName }: Props) {
  if (!items?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className={cn('flex', className)}>
      <ol className={cn('flex items-center space-x-2 text-sm', listClassName)}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.href ?? item.label}-${i}`} className="flex items-center">
              {last || !item.href ? (
                <span className="text-muted-foreground">{item.label}</span>
              ) : (
                <>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                  <span className="mx-2 text-muted-foreground">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
