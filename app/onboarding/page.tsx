import OnboardingPage from './OnboardingClient';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function Page() {
  return <OnboardingPage />;
}
