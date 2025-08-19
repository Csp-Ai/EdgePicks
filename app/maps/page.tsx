export const revalidate = 0 as const;
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function Page() {
  const MapClient = (await import('./MapClient')).default;
  return <MapClient />;
}
