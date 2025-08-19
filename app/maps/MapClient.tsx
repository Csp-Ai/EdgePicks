'use client';
import dynamic from 'next/dynamic';
const CommunityNeedsMap = dynamic(() => import('./CommunityNeedsMapClient'), { ssr: false });
export default function MapClient(props: any) {
  return <CommunityNeedsMap {...props} />;
}
