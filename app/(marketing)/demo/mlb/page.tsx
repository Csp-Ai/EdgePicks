import type { Metadata } from 'next';
import DemoPageClient from '../DemoPageClient';
export const revalidate = 60 as const;
export const dynamic = 'auto';
export const fetchCache = 'default';
export const metadata: Metadata = { title: 'Demo MLB' };

export default function Page() {
  return <DemoPageClient league="mlb" />;
}
