import TrustPage from './TrustPageClient';
export const revalidate = 60 as const;
export const dynamic = 'auto';

export default function Page() {
  return <TrustPage />;
}
