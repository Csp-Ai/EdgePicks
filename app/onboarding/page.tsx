'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  saveProfile,
  Profile,
  Purpose,
  ConsentTier,
  SustainabilityMode,
} from '@/lib/profile/prefs';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const dynamicParams = true;

const purposes: Purpose[] = ['researcher', 'clinician', 'advocate', 'builder'];
const consents: ConsentTier[] = ['low', 'medium', 'high'];
const sustainability: SustainabilityMode[] = ['off', 'balanced', 'max'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<Profile>>({});

  const handleSelect = (field: keyof Profile, value: string) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setStep((s) => s + 1);
  };

  const finish = (value: SustainabilityMode) => {
    const finalProfile: Profile = {
      ...(profile as Omit<Profile, 'sustainability'>),
      sustainability: value,
    };
    saveProfile(finalProfile);
    router.push('/');
  };

  return (
    <div className="p-4 space-y-4">
      {step === 0 && (
        <div>
          <h1 className="text-xl mb-2">Choose your purpose</h1>
          <div className="flex flex-col gap-2">
            {purposes.map((p) => (
              <button
                key={p}
                onClick={() => handleSelect('purpose', p)}
                className="border px-3 py-2 rounded"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 1 && (
        <div>
          <h1 className="text-xl mb-2">Consent tier</h1>
          <div className="flex flex-col gap-2">
            {consents.map((c) => (
              <button
                key={c}
                onClick={() => handleSelect('consent', c)}
                className="border px-3 py-2 rounded"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <h1 className="text-xl mb-2">Sustainability mode</h1>
          <div className="flex flex-col gap-2">
            {sustainability.map((s) => (
              <button
                key={s}
                onClick={() => finish(s)}
                className="border px-3 py-2 rounded"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

