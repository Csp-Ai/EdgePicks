import ImpactDashboard from './ImpactDashboardClient';
export const revalidate = 60 as const;
export const dynamic = 'auto';
export const dynamicParams = true;

export default function Page() {
  return <ImpactDashboard />;
}
