'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
];

const Nav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={pathname === l.href ? 'page' : undefined}
          className={cn(
            'text-sm font-medium hover:underline',
            pathname === l.href ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'
          )}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
};

export default Nav;
