import type { Metadata } from 'next';
import DemoPageClient from '../DemoPageClient';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata: Metadata = { title: 'Demo MLB' };

export default function Page() {
  return <DemoPageClient league="mlb" />;
}
