import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import GoalPicker from './onboarding/GoalPicker';

const STORAGE_KEY = 'onboardingComplete';
const GOAL_KEY = 'userGoal';
const STEPS = [
  { title: 'Welcome', text: 'Thanks for joining the EdgePicks beta.' },
  { title: 'Smart Picks', text: 'Our agents help you make data-driven choices.' },
  { title: 'Offline Ready', text: 'Load once and access picks even without internet.' },
];

export default function Onboarding() {
  const { status } = useSession();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY) === '1') return;

    fetch('/api/user/onboarding')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasSeen) {
          localStorage.setItem(STORAGE_KEY, '1');
        } else {
          setShow(true);
        }
      })
      .catch(() => {
        setShow(true);
      });
  }, [status]);

  const handleGoalSelect = (goal: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GOAL_KEY, goal);
    }
    setStep(0);
  };

  const finish = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, '1');
    }
    fetch('/api/user/onboarding', { method: 'POST' }).catch(() => {});
    setShow(false);
  };

  if (!show) return null;

  if (step === -1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 text-white">
        <div className="bg-gray-900 p-6 rounded max-w-sm w-full space-y-4 text-center">
          <GoalPicker onSelect={handleGoalSelect} />
          <div className="flex justify-end pt-4">
            <button onClick={finish} className="px-4 py-2 border rounded">
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { title, text } = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 text-white">
      <div className="bg-gray-900 p-6 rounded max-w-sm w-full space-y-4 text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p>{text}</p>
        <div className="flex justify-between pt-4">
          <button onClick={finish} className="px-4 py-2 border rounded">
            Skip
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-blue-600 rounded"
            >
              Next
            </button>
          ) : (
            <button onClick={finish} className="px-4 py-2 bg-blue-600 rounded">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
