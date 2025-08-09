import Link from 'next/link';
import { cn } from '@/lib/utils';
import Landmarks from '@/components/a11y/Landmarks';

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /**
   * Classes applied to the wrapping <nav> element.
   */
  className?: string;
  /**
   * Classes applied to the list element.
   */
  listClassName?: string;
}

export default function Breadcrumbs({ items, className, listClassName }: BreadcrumbsProps) {
  if (!items?.length) return null;

  return (
    <Landmarks label="Breadcrumb" className={className}>
      <ol className={cn('flex items-center gap-2 text-sm', listClassName)}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center">
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                  <span className="px-1" aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </Landmarks>
  );
}
