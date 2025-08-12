export const revalidate = 0 as const;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import DemoPageClient from '../demo/DemoPageClient';

export default function Page() {
  return <DemoPageClient league="all" />;
}

