import React from 'react';
import { Inbox, FileX2, ShieldAlert, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmptyProps {
  variant?: 'empty' | 'zero' | 'permission';
  title?: string;
  description?: string;
  className?: string;
}

const variants: Record<NonNullable<EmptyProps['variant']>, { icon: LucideIcon; title: string; description: string }> = {
  empty: {
    icon: Inbox,
    title: 'Nothing here',
    description: 'There is currently no data to display.',
  },
  zero: {
    icon: FileX2,
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
  permission: {
    icon: ShieldAlert,
    title: 'Permission denied',
    description: 'You do not have access to view this content.',
  },
};

const Empty: React.FC<EmptyProps> = ({
  variant = 'empty',
  title,
  description,
  className,
}) => {
  const { icon: Icon, title: defaultTitle, description: defaultDescription } =
    variants[variant];
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center text-center text-gray-500 p-8', className)}
    >
      <Icon aria-hidden className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-semibold mb-1">{title ?? defaultTitle}</h3>
      <p className="text-sm">{description ?? defaultDescription}</p>
    </div>
  );
};

export default Empty;
