import CommunityNeedsMap from './CommunityNeedsMapClient';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function Page() {
  return <CommunityNeedsMap />;
}
